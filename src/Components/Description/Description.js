import { h, render, Component } from 'preact';
import moment from 'moment';
import MarkdownIt from 'markdown-it';

// Configure plugins
moment.locale('es');
const md = new MarkdownIt();

import s from './Description.css';
export default class Description extends Component {
  constructor() {
    super();

    this.state = {
      left: '-50%',
      top: '0%'
    }
  }

  // componentWillReceiveProps(newProps) {
  //   this.setState({left: '-50%'});
  // //   setTimeout(() => {
  // //     this.handlePosition(newProps);
  // //   }, 100);
  // // }
  //
  // componentDidMount() {
  //   this.handlePosition(this.props);
  // }
  // //
  // // handlePosition(props) {
  //   const { pos } = props;
  //   const bbox = this.el.getBoundingClientRect();
  //   if (bbox.left < 0) {
  //     this.setState({ left: '0%' });
  //   } else if (bbox.right > pos.containerWidth) {
  //     this.setState({ left: '-100%' });
  //   }
  // }

  render(props, state) {
    const { content, pos } = props;
    const { left, top } = state;
    const formattedContent = md.render(String(content));
    // const style = {
    //   left: pos.left,
    //   top: pos.top,
    //   transform: `translate(${left}, ${top})`
    // };
    return (
      <div ref={(el) => this.el = el} className={s.container}>
        <div className={s.content} dangerouslySetInnerHTML={{ __html: formattedContent }} />
      </div>
    )
  }
}