import React, { PureComponent } from 'react';
import classNames from 'classnames';
import './assets/Line.css';

export interface LineProps {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  className?: string;
}

export default class Line extends PureComponent<LineProps> {
  static defaultProps = {
    x0: 0,
    y0: 0,
    x1: 0,
    y1: 0,
  };

  render() {
    const { x0, y0, x1, y1, className } = this.props;
    const dy = y1 - y0;
    const dx = x1 - x0;
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    const width = Math.sqrt(dx * dx + dy * dy);
    return (
      <div
        className={classNames('line-core', className)}
        style={{
          top: `${y0}px`,
          left: `${x0}px`,
          width: `${width}px`,
          transform: `rotate(${angle}deg)`,
        }}
      />
    );
  }
}
