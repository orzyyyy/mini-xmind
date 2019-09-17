import React from 'react';
import classNames from 'classnames';
import './css/Line.css';

export interface LineProps {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  className?: string;
  style?: React.CSSProperties;
  showArrow?: boolean;
}

const Line = ({
  x0 = 0,
  y0 = 0,
  x1 = 0,
  y1 = 0,
  className,
  style,
  showArrow,
}: LineProps) => {
  const dy = y1 - y0;
  const dx = x1 - x0;
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  const width = Math.sqrt(dx * dx + dy * dy);
  return (
    <div
      className={classNames({
        'line-core': !showArrow,
        'line-core-with-arrow': showArrow,
        className,
      })}
      style={Object.assign(
        {
          width: `${width}px`,
          transform: `translate3d(${x0}px, ${y0}px, 0) rotate(${angle}deg)`,
        },
        style,
      )}
    />
  );
};

export default Line;
