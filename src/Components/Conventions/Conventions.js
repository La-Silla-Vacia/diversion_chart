import { h, render, Component } from 'preact';
import cn from 'classnames';

import s from './Conventions.css';
export default class Description extends Component {
  render(props, state) {
    return (
      <ul className={s.container}>
        <li>
          <div className={cn(s.shape, s.circle)} />
          Los hitos de la triple A
        </li>
        <li>
          <div className={cn(s.shape, s.light)} />
          Participación de los privados
        </li>
        <li>
          <div className={cn(s.shape, s.dark)} />
          Participación del Distrito
        </li>
      </ul>
    )
  }
}