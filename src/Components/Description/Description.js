import { h, render, Component } from 'preact';
import moment from 'moment';
import MarkdownIt from 'markdown-it';

// Configure plugins
moment.locale('es');
const md = new MarkdownIt();

import s from './Description.css';
export default class Description extends Component {
  render(props, state) {
    const { content, style } = props;
    const formattedContent = md.render(String(content));
    return (
      <div style={style} className={s.container}>
        <div className={s.content} dangerouslySetInnerHTML={{ __html: formattedContent }} />
      </div>
    )
  }
}