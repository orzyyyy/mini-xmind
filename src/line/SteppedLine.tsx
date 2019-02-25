import React, { PureComponent } from 'react';
import Line from './core';
const defaultBorderWidth = 1;

export interface SteppedLineProps {
  orientation?: 'h' | 'v' | 'horizonal' | 'vertical' | string;
  className?: string;
  style?: any;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  borderWidth?: number;
}

export default class SteppedLine extends PureComponent<SteppedLineProps> {
  static defaultProps = {
    orientation: 'h',
    className: '',
    style: {},
  };

  renderVertical = () => {
    const { x0, y0, x1, y1, borderWidth = defaultBorderWidth } = this.props;

    const dx = x1 - x0;
    if (dx === 0) {
      return <Line {...this.props} />;
    }

    const y2 = (y0 + y1) / 2;

    const xOffset = dx > 0 ? borderWidth : 0;
    const minX = Math.min(x0, x1) - xOffset;
    const maxX = Math.max(x0, x1);

    return (
      <div className="stepped-lineto">
        <Line {...this.props} x0={x0} y0={y0} x1={x0} y1={y2} />
        <Line {...this.props} x0={x1} y0={y1} x1={x1} y1={y2} />
        <Line {...this.props} x0={minX} y0={y2} x1={maxX} y1={y2} />
      </div>
    );
  };

  renderHorizontal = () => {
    const { x0, y0, x1, y1, borderWidth = defaultBorderWidth } = this.props;

    const dy = y1 - y0;
    if (dy === 0) {
      return <Line {...this.props} />;
    }

    const x2 = (x0 + x1) / 2;

    const yOffset = dy < 0 ? borderWidth : 0;
    const minY = Math.min(y0, y1) - yOffset;
    const maxY = Math.max(y0, y1);

    return (
      <div className="stepped-line">
        <Line {...this.props} x0={x0} y0={y0} x1={x2} y1={y0} />
        <Line {...this.props} x0={x1} y0={y1} x1={x2} y1={y1} />
        <Line {...this.props} x0={x2} y0={minY} x1={x2} y1={maxY} />
      </div>
    );
  };

  render() {
    const { orientation } = this.props;
    let result;

    switch (orientation) {
      case 'horizonal':
      case 'h':
        result = this.renderHorizontal();
        break;

      case 'vertical':
      case 'v':
        result = this.renderVertical();
        break;
    }

    return result;
  }
}
