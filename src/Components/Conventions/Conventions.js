import { h, render, Component } from 'preact';
import cn from 'classnames';

import s from './Conventions.css';
export default class Description extends Component {
  render(props, state) {
    return (
      <ul className={s.container}>
        <li>
          <div className={cn(s.shape, s.circle)} />
          los hitos de la triple A
        </li>
        <li>
          <div className={cn(s.shape, s.square)} />
          Cuadrado: Lo que se movía tras bambalinas
        </li>
        <li>
          <div className={cn(s.shape, s.light)} />
          Color amarillo: participación de los privados
        </li>
        <li>
          <div className={cn(s.shape, s.dark)} />
          Color naranja: participación del Distrito
        </li>
      </ul>
    )
  }
}