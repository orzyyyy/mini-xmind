import React from 'react';
import Line from './Line';
import {
  getLineCoordinatesForHorizonal,
  getLineCoordinatesForVertical,
} from '../utils/LineUtil';

export type OrientationProps = 'horizonal' | 'vertical';
export interface SteppedLineProps {
  className?: string;
  from: any;
  to: any;
  offset?: { x: number; y: number };
  orientation?: OrientationProps;
}

const SteppedLine = ({
  from,
  to,
  offset = { x: 0, y: 0 },
  orientation,
}: SteppedLineProps) => {
  const renderHorizonal = () => {
    const {
      x0,
      x1,
      y0,
      y1,
      centerX,
      firstLineVisible,
      secondLineVisible,
      thirdLineVisible,
    } = getLineCoordinatesForHorizonal(from, to, offset);

    return (
      <div className="stepped-line">
        {firstLineVisible && <Line x0={x0} y0={y0} x1={centerX} y1={y0} />}
        {secondLineVisible && (
          <Line x0={centerX} y0={y0} x1={centerX} y1={y1} />
        )}
        {thirdLineVisible && <Line x0={centerX} y0={y1} x1={x1} y1={y1} />}
      </div>
    );
  };

  const renderVertical = () => {
    const {
      x0,
      x1,
      y0,
      y1,
      centerY,
      firstLineVisible,
      secondLineVisible,
      thirdLineVisible,
    } = getLineCoordinatesForVertical(from, to, offset);

    return (
      <div className="stepped-line">
        {firstLineVisible && <Line x0={x0} y0={y0} x1={x0} y1={centerY} />}
        {secondLineVisible && (
          <Line x0={x0} y0={centerY} x1={x1} y1={centerY} />
        )}
        {thirdLineVisible && <Line x0={x1} y0={centerY} x1={x1} y1={y1} />}
      </div>
    );
  };

  if (orientation === 'horizonal') {
    return renderHorizonal();
  }

  if (orientation === 'vertical') {
    return renderVertical();
  }

  return renderHorizonal();
};

export default SteppedLine;
