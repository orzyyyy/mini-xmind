import React from 'react';
import Line from './Line';
import { getLineCoordinates } from '../utils/LineUtil';

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
  ...rest
}: SteppedLineProps) => {
  const {
    x0,
    x1,
    y0,
    y1,
    centerX,
    firstLineVisible,
    secondLineVisible,
    thirdLineVisible,
  } = getLineCoordinates(from, to, offset);

  return (
    <div className="stepped-line">
      {firstLineVisible && (
        <Line x0={x0} y0={y0} x1={centerX} y1={y0} {...rest} />
      )}
      {secondLineVisible && (
        <Line x0={centerX} y0={y0} x1={centerX} y1={y1} {...rest} />
      )}
      {thirdLineVisible && (
        <Line x0={centerX} y0={y1} x1={x1} y1={y1} {...rest} />
      )}
    </div>
  );
};

export default SteppedLine;
