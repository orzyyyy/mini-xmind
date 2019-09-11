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
      firstLineX0,
      firstLineY0,
      firstLineX1,
      firstLineY1,
      secondLineX0,
      secondLineY0,
      secondLineX1,
      secondLineY1,
      thirdLineX0,
      thirdLineY0,
      thirdLineX1,
      thirdLineY1,
    } = getLineCoordinatesForHorizonal(from, to, offset);

    return (
      <div className="stepped-line">
        <Line
          x0={firstLineX0}
          y0={firstLineY0}
          x1={firstLineX1}
          y1={firstLineY1}
        />
        <Line
          x0={secondLineX0}
          y0={secondLineY0}
          x1={secondLineX1}
          y1={secondLineY1}
        />
        <Line
          x0={thirdLineX0}
          y0={thirdLineY0}
          x1={thirdLineX1}
          y1={thirdLineY1}
        />
      </div>
    );
  };

  const renderVertical = () => {
    const {
      firstLineX0,
      firstLineY0,
      firstLineX1,
      firstLineY1,
      secondLineX0,
      secondLineY0,
      secondLineX1,
      secondLineY1,
      thirdLineX0,
      thirdLineY0,
      thirdLineX1,
      thirdLineY1,
    } = getLineCoordinatesForVertical(from, to, offset);

    return (
      <div className="stepped-line">
        <Line
          x0={firstLineX0}
          y0={firstLineY0}
          x1={firstLineX1}
          y1={firstLineY1}
        />
        <Line
          x0={secondLineX0}
          y0={secondLineY0}
          x1={secondLineX1}
          y1={secondLineY1}
        />
        <Line
          x0={thirdLineX0}
          y0={thirdLineY0}
          x1={thirdLineX1}
          y1={thirdLineY1}
        />
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
