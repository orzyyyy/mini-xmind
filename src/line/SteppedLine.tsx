import React from 'react';
import Line from './core';

export interface SteppedLineProps {
  orientation?: 'h' | 'v' | 'horizonal' | 'vertical' | string;
  className?: string;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

const SteppedLine = ({ x0, y0, x1, y1, ...rest }: SteppedLineProps) => {
  const renderVertical = () => {
    const dx = x1 - x0;
    if (dx === 0) {
      return <Line x0={x0} y0={y0} x1={x1} y1={y0} {...rest} />;
    }
    const y2 = (y0 + y1) / 2;
    const xOffset = dx > 0 ? 1 : 0;
    const minX = Math.min(x0, x1) - xOffset;
    const maxX = Math.max(x0, x1);
    return (
      <div className="stepped-line">
        <Line x0={x0} y0={y0} x1={x0} y1={y2} {...rest} />
        <Line x0={x1} y0={y1} x1={x1} y1={y2} {...rest} />
        <Line x0={minX} y0={y2} x1={maxX} y1={y2} {...rest} />
      </div>
    );
  };

  const renderHorizontal = () => {
    const dy = y1 - y0;
    if (dy === 0) {
      return <Line x0={x0} y0={y0} x1={x1} y1={y0} {...rest} />;
    }
    const x2 = (x0 + x1) / 2;
    const yOffset = dy < 0 ? 1 : 0;
    const minY = Math.min(y0, y1) - yOffset;
    const maxY = Math.max(y0, y1);
    return (
      <div className="stepped-line">
        <Line x0={x0} y0={y0} x1={x2} y1={y0} {...rest} />
        <Line x0={x1} y0={y1} x1={x2} y1={y1} {...rest} />
        <Line x0={x2} y0={minY} x1={x2} y1={maxY} {...rest} />
      </div>
    );
  };

  switch (rest.orientation) {
    case 'horizonal':
    case 'h':
      return renderHorizontal();
    case 'vertical':
    case 'v':
      return renderVertical();
    default:
      return renderHorizontal();
  }
};

export default SteppedLine;
