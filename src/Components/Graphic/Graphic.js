import { h, render, Component } from 'preact';
import moment from 'moment';
import cn from 'classnames';

// Configure plugins
moment.locale('es');

import Description from '../Description';

import s from './Graphic.css';
const vWidth = 2000;
const padding = 50;
const vHeight = 1125;

export default class Base extends Component {

  constructor() {
    super();

    this.state = {
      width: 320,
      height: 320,
      data: [],
      start: 0,
      end: 320,
      duration: 160,
      showDescription: false,
      lineX: 150,
      positions: [],
      markerSize: 15,
      mousePosition: 'left',
      locked: false
    };

    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.width !== newProps.width) {
      this.setSizes(newProps.width);
    }

    if (this.props.data !== newProps.data) {
      this.setData(newProps.data);
    }
  }

  setData(data) {
    if (!data.length) return;
    const start = moment(data[0].date).unix();
    const end = moment(data[data.length - 1].date).unix();
    const duration = end - start;
    this.setState({ start, end, duration, data });
    const positions = data.map((event) => {
      const { date, id, percentage_district, businessEvent, shadowEvent } = event;
      const x = this.getTimePostion(date);
      const y = this.getPercentagePosition(percentage_district);
      const shadow = !!(shadowEvent);
      return {
        id, x, y, date, shadow, active: false,
        content: { businessEvent, shadowEvent },
        percentage: percentage_district
      };
    });

    this.setState({ positions, showDescription: positions[0] });
  }

  setSizes(width) {
    let markerSize = width / 70;
    if (width < 850) {
      markerSize = width / 50;
    }
    if (width < 650) {
      markerSize = width / 30;
    }
    if (width < 450) {
      markerSize = width / 15;
    }
    const height = width / 16 * 9;
    this.setState({ width, height, markerSize });
  }

  getPercentageBar() {
    let numbers = [];
    for (let i = 0; i < 101; i++) {
      numbers.push(i);
    }

    const height = vHeight / numbers.length;
    return numbers.map((number, i) => {
      if (i % 5) return;
      return (
        <g x={0} transform={`translate(0, ${height * (numbers.length - number)})`}>
          <text className={s.percentage}>{number}%</text>
        </g>
      )
    });
  }

  getTimeline() {
    const { data, markerSize } = this.state;
    const dateCount = data.length;
    if (!dateCount) return;
    const dates = [];
    return data.map((event) => {
      const { date, id } = event;
      const dateText = moment(date).format('YYYY');
      if (dates.indexOf(dateText) !== -1) return;
      dates.push(dateText);
      let x = this.getTimePostion(date) - (markerSize * 2);
      if (id === 1) x += markerSize;
      if (id === dateCount) x -= 10;

      return (
        <g transform={`translate(${x}, ${vHeight - 10})`}>
          <text className={s.time}>{dateText}</text>
        </g>
      );
    });
  }

  getTimePostion(date) {
    const { start, duration } = this.state;
    const time = moment(date).unix() - start;
    const percentage = time * 100 / duration;
    return padding * 1.5 + (percentage * (vWidth - padding * 2) / 100);
  }

  getPercentagePosition(percentage) {
    return vHeight - (percentage * vHeight / 100);
  }

  getMarkers() {
    const { positions, markerSize } = this.state;
    let hasLine = [];
    return positions.map((event) => {
      const { id, x, y, content, shadow, active, percentage } = event;

      const shadowLine = (hasLine.indexOf(percentage) === -1) ? (
        <line x1="0" x2={vWidth} y1={markerSize} y2={markerSize} strokeWidth={1} stroke="rgba(255,255,255,1)"
              stroke-dasharray="10, 10" />
      ) : false;
      const circleLine = (hasLine.indexOf(percentage) === -1) ? (
        <line x1="0" x2={vWidth} y1={0} y2={0} strokeWidth={1} stroke="rgba(255,255,255,1)"
              stroke-dasharray="10, 10" />
      ) : false;
      hasLine.push(percentage);

      if (shadow) {
        return (
          <g transform={`translate(0, ${y - markerSize})`}>
            {shadowLine}
            <rect key={id} className={cn(s.marker, s.square, { [s.marker__active]: active })}
                  onClick={this.showDescription.bind(this, content)}
                  width={markerSize * 2} height={markerSize * 2} x={x - markerSize} />
          </g>
        )
      } else {
        return (
          <g transform={`translate(0, ${y})`}>
            {circleLine}
            <circle key={id} cx={x} className={cn(s.marker, s.circle, { [s.marker__active]: active })}
                    onClick={this.showDescription.bind(this, content)}
                    r={markerSize} />
          </g>
        )
      }
    });
  }

  showDescription(data) {
    this.setState({ showDescription: data });
  }

  getDescription() {
    const { mousePosition } = this.state;
    const data = this.state.showDescription;
    // console.log('hi', this.state);
    return (
      <Description position={mousePosition} {...data} />
    );
  }

  getShape() {
    const { positions } = this.state;
    if (!positions.length) return;
    let path = '';
    let lY = 225;
    for (let i = 0; i < positions.length; i++) {
      const event = positions[i];
      const { x, y } = event;
      lY = y;
      if (x > 0)
        path += `${x},${y} `;
    }
    const businessPath = path + `${vWidth},${lY} ${vWidth},0 ${padding},0 ${padding},${positions[0].y}`;
    const districtPath = path + `${vWidth},${lY} ${vWidth},${vHeight} ${padding},${vHeight} ${padding},${positions[0].y}`;

    return (
      <g>
        <polygon points={businessPath} fill="#4adce7" />
        <polygon points={districtPath} fill="#09375c" />
      </g>
    )
  }

  handleMouseMove(e, force) {
    const { width, positions, markerSize, locked } = this.state;
    if (locked && !force) return;
    const layerX = e.layerX;
    const xPercentage = layerX * 100 / width;
    const canvasX = xPercentage * vWidth / 100;
    if (canvasX < padding) return;

    const mousePosition = (xPercentage < 50) ? 'left' : 'right';

    let closest = positions[0];
    const nPositions = [];
    for (let i = 0; i < positions.length; i++) {
      positions[i].active = false;
      if ((positions[i].x - markerSize) < canvasX) {
        closest = positions[i];
      }
      nPositions.push(positions[i]);
    }
    const index = nPositions.indexOf(closest);
    if (index !== -1)
      nPositions[index].active = true;
    this.setState({ lineX: canvasX, showDescription: closest, positions: nPositions, mousePosition });
  }

  handleTouchMove(e) {
    e.preventDefault();
    this.handleMouseMove(e, true);
  }

  handleClick(e) {
    this.handleMouseMove(e, true);
    this.setState({locked: !this.state.locked});
  }

  getLine() {
    const { lineX } = this.state;
    if (lineX > padding) {
      return (
        <line x1={lineX} y1={0} x2={lineX} y2={vHeight} className={s.line} />
      )
    }
  }

  render(props, state) {
    const { width, height, showDescription } = state;
    const percentageBar = this.getPercentageBar();
    const timeline = this.getTimeline();
    const shape = this.getShape();
    const markers = this.getMarkers();
    const description = (showDescription) ? this.getDescription() : false;
    const line = this.getLine();


    // console.log(showDescription);

    return (
      <div ref={(el) => this.root = el} className={s.container}>
        <svg width={width} height={height}
             onTouchMove={this.handleTouchMove}
             onMouseMove={this.handleMouseMove}
             onClick={this.handleClick}
             viewBox={`0 0 ${vWidth} ${vHeight}`}
             className={s.svg}>
          {shape}
          {percentageBar}
          {timeline}
          {markers}
          {line}
        </svg>
        {description}
      </div>
    )
  }
}