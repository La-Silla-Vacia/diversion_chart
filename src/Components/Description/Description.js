import { h, render, Component } from 'preact';
import moment from 'moment';
import MarkdownIt from 'markdown-it';
import cn from 'classnames';

// Configure plugins
moment.locale('es');
const md = new MarkdownIt();


// Remember old renderer, if overriden, or proxy to default renderer
const defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  // If you are sure other plugins can't add `target` - drop check below
  const aIndex = tokens[idx].attrIndex('target');

  if (aIndex < 0) {
    tokens[idx].attrPush(['target', '_blank']); // add new attribute
  } else {
    tokens[idx].attrs[aIndex][1] = '_blank';    // replace value of existing attr
  }

  // pass token to default renderer.
  return defaultRender(tokens, idx, options, env, self);
};



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
        <h2 className={s.title}>La movida del poder detrás <span>- {moment(date).format('YYYY')}</span></h2>
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