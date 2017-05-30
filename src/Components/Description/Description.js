import { h, render, Component } from 'preact';
import moment from 'moment';
import MarkdownIt from 'markdown-it';
import cn from 'classnames';

// Configure plugins
moment.locale('es');
const md = new MarkdownIt();

import s from './Description.css';
export default class Description extends Component {
  render(props, state) {
    const { content, date, position } = props;
    const { businessEvent, shadowEvent } = content;
    const formattedShadowContent = md.render(String(shadowEvent));
    const formattedBusinessContent = md.render(String(businessEvent));
    const business = (businessEvent) ? (
      <div className={s.group}>
        <h2 className={s.title}>Los hitos de la Triple A <span>- {moment(date).format('YYYY')}</span></h2>
        <div className={s.content} dangerouslySetInnerHTML={{ __html: formattedBusinessContent }} />
      </div>
    ) : false;

    const shadow = (shadowEvent) ? (
      <div className={s.group}>
        <h2 className={s.title}>Lo que se movía tras bambalinas (o nadie dice) <span>- {moment(date).format('YYYY')}</span></h2>
        <div className={s.content} dangerouslySetInnerHTML={{ __html: formattedShadowContent }} />
      </div>
    ) : false;

    return (
      <div className={cn(s.container, {[s.left]: position === 'right'})}>
        {business}
        {shadow}
      </div>
    )
  }
}