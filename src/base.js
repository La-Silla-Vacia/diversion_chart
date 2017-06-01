import { h, render, Component } from 'preact';

import s from './base.css';
import Graphic from "./Components/Graphic";
import Conventions from './Components/Conventions';
const data = require('../data/data.json');

export default class Base extends Component {

  constructor() {
    super();

    this.state = {
      data: [],
      width: 320
    };

    this.handleResize = this.handleResize.bind(this);
  }

  componentWillMount() {
    this.setData();
  }

  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  handleResize() {
    const { width } = this.props;
    this.setState({ width: width() });
  }

  setData() {
    let dataExists = true;
    let interactiveData;
    let dataUri;
    try {
      if (diversion_chart_data) {
        dataExists = true;
        interactiveData = diversion_chart_data;
      }
    } catch (e) {
      dataExists = false;
    }

    if (!dataExists) {
      this.setState({ data: data });
    } else {
      if (interactiveData.dataUri) {
        dataUri = interactiveData.dataUri;
        this.fetchData(dataUri);
      }
    }
  }

  fetchData(uri) {
    fetch(uri)
      .then((response) => {
        return response.json()
      }).then((json) => {
      this.formatData(json);
    }).catch((ex) => {
      console.log('parsing failed', ex)
    })
  }

  formatData(data) {
    const items = data.map((rawItem, index) => {
      const { año, percentage_Distrito, percentage_Total, losHitosDeLaTripleA } = rawItem;
      if (!año) return null;
      return {
        id: index + 1,
        date: año,
        percentage_district: percentage_Distrito,
        percentage_total: percentage_Total,
        businessEvent: losHitosDeLaTripleA,
      };
    });
    const newData = items.filter(function (n) {
      return n != undefined
    });
    this.setState({ data: newData });
  }

  render(props, state) {
    const { data, width } = state;
    return (
      <div className={s.container}>
        <Conventions />
        <Graphic width={width} data={data} />
      </div>
    )
  }
}