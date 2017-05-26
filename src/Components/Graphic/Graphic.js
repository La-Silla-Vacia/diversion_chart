import { h, render, Component } from 'preact';
import moment from 'moment';
import MarkdownIt from 'markdown-it';
import cn from 'classnames';

// Configure plugins
moment.locale('es');
const md = new MarkdownIt();

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
      lineX: 40,
      positions: []
    };

    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (this.props !== newProps) {
      this.setData(newProps.data);
      this.setSizes(newProps.width);
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
      const shadow = (shadowEvent) ? true : false;
      return {
        id, x, y, shadow, active: false, content: (businessEvent) ? businessEvent : shadowEvent
      };
    });

    this.setState({ positions });
  }

  setSizes(width) {
    const height = width / 16 * 9;
    this.setState({ width, height });
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
          <text>{number}%</text>
        </g>
      )
    });
  }

  getTimeline() {
    const { data } = this.state;
    if (!data.length) return;
    const dates = [];
    return data.map((event) => {
      const { date } = event;
      const dateText = moment(date).format('YYYY');
      if (dates.indexOf(dateText) !== -1) return;
      dates.push(dateText);
      const x = this.getTimePostion(date);
      return (
        <g transform={`translate(${x}, ${vHeight})`}>
          <text>{dateText}</text>
        </g>
      );
    });
  }

  getTimePostion(date) {
    const { start, duration } = this.state;
    const time = moment(date).unix() - start;
    const percentage = time * 100 / duration;
    return padding + (percentage * (vWidth - padding * 2) / 100);
  }

  getPercentagePosition(percentage) {
    return vHeight - (percentage * vHeight / 100);
  }

  getMarkers() {
    const { positions } = this.state;
    return positions.map((event) => {
      const { id, x, y, content, shadow, active } = event;

      if (shadow) {
        return (
          <rect key={id} className={cn(s.marker, { [s.marker__active]: active })}
                onClick={this.showDescription.bind(this, content)}
                width={30} height={30} x={x - 15} y={y - 15} />
        )
      } else {
        return (
          <circle key={id} className={cn(s.marker, { [s.marker__active]: active })} tabIndex={0}
                  onClick={this.showDescription.bind(this, content)}
                  r="15" cx={x} cy={y} />
        )
      }
    });
  }

  showDescription(data) {
    this.setState({ showDescription: data });
  }

  getDescription() {
    const data = this.state.showDescription;

    return (
      <Description {...data} />
    );
  }

  getShape() {
    const { data } = this.state;
    let path = '';
    let lY = 225;
    for (let i = 0; i < data.length; i++) {
      const event = data[i];
      const { date, percentage_district } = event;
      const x = this.getTimePostion(date);
      const y = lY = this.getPercentagePosition(percentage_district);
      if (x > 0)
        path += `${x},${y} `;
    }
    const businessPath = path + `${vWidth},${lY} ${vWidth},0 ${padding},0`;
    const districtPath = path + `${vWidth},${lY} ${vWidth},${vHeight} ${padding},${vHeight}`;

    return (
      <g>
        <polygon points={districtPath} fill="#f6b217" />
        <polygon points={businessPath} fill="#f08800" />
      </g>
    )
  }

  handleMouseMove(e) {
    const { width, positions } = this.state;
    const layerX = e.layerX;
    const xPercentage = layerX * 100 / width;
    const canvasX = xPercentage * vWidth / 100;

    if (canvasX < padding) return;

    let closest;
    const nPositions = [];
    for (let i = 0; i < positions.length; i++) {
      positions[i].active = false;
      if ((positions[i].x - 15) < canvasX) {
        closest = positions[i];
      }
      nPositions.push(positions[i]);
    }
    const index = nPositions.indexOf(closest);
    if (index !== -1)
      nPositions[index].active = true;
    this.setState({ lineX: canvasX, showDescription: closest, positions: nPositions });
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

    return (
      <div className={s.container}>
        <svg width={width} height={height} onMouseMove={this.handleMouseMove} viewBox={`0 0 ${vWidth} ${vHeight}`}
             className={s.container}>
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