import { h, render, Component } from 'preact';
import moment from 'moment';
import MarkdownIt from 'markdown-it';

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
      showDescription: false
    }
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
    return data.map((event) => {
      const { date } = event;
      const x = this.getTimePostion(date);
      return (
        <g transform={`translate(${x}, ${vHeight})`}>
          <text>{moment(date).format('MMMM YYYY')}</text>
        </g>
      );
    });
  }

  getTimePostion(date) {
    const { start, duration } = this.state;
    const time = moment(date).unix() - start;
    const percentage = time * 100 / duration;
    return padding + (percentage * (vWidth - (padding * 3)) / 100);
  }

  getPercentagePosition(percentage) {
    return vHeight - (percentage * vHeight / 100);
  }

  getMarkers() {
    const { data } = this.state;
    return data.map((event) => {
      const { date, percentage_district, businessEvent, shadowEvent } = event;
      const x = this.getTimePostion(date);
      const y = this.getPercentagePosition(percentage_district);
      const descriptionData = {
        x, y, content: (businessEvent) ? businessEvent : shadowEvent
      };

      if (businessEvent) {
        return (
          <circle className={s.marker} tabIndex={0} onClick={this.showDescription.bind(this, descriptionData)} r="15"
                  cx={x} cy={y} />
        )
      } else {
        return (
          <rect onClick={this.showDescription.bind(this, descriptionData)} r="15" cx={x} cy={y} />
        )
      }
    });
  }

  showDescription(data) {
    const nData = (data.content === this.state.showDescription.content) ? false : data;
    this.setState({ showDescription: nData });
  }

  getDescription() {
    const { width } = this.state;
    const data = this.state.showDescription;
    const style = {
      top: `${data.y * 100 / vHeight}%`,
      left: `${data.x * 100 / vWidth}%`,
      containerWidth: width
    };

    return (
      <Description pos={style} {...data} />
    );
  }

  getShape() {
    const { data } = this.state;
    let path = '';
    for (let i = 0; i < data.length; i++) {
      const event = data[i];
      const { date, percentage_district } = event;
      const x = this.getTimePostion(date);
      const y = this.getPercentagePosition(percentage_district);
      if (x > 0)
        path += `${x},${y} `;
    }
    const districtPath = path + `${vWidth - padding * 2},0 ${padding},0`;
    const businessPath = path + `${vWidth - padding * 2},${vHeight} ${padding},${vHeight}`;

    return (
      <g>
        <polygon points={districtPath} fill="#f6b217" />
        <polygon points={businessPath} fill="#cd2843" />
      </g>
    )
  }

  render(props, state) {
    const { width, height, showDescription } = state;
    const percentageBar = this.getPercentageBar();
    const timeline = this.getTimeline();
    const shape = this.getShape();
    const markers = this.getMarkers();
    const description = (showDescription) ? this.getDescription() : false;

    return (
      <div className={s.container}>
        <svg width={width} height={height} viewBox={`0 0 ${vWidth} ${vHeight}`} className={s.container}>
          {shape}
          {percentageBar}
          {timeline}
          {markers}
        </svg>
        {description}
      </div>
    )
  }
}