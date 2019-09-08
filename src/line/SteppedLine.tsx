import React from 'react';
import Line from './Line';
import { getLineCoordinates } from '../utils/LineUtil';
// import { detect } from '../utils/LineUtil';

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
  ...rest
}: SteppedLineProps) => {
  // const { x0, y0, x1, y1, ...rest } = detect(props);

  // const renderVertical = () => {
  //   const dx = x1 - x0;
  //   if (dx === 0) {
  //     return <Line x0={x0} y0={y0} x1={x1} y1={y0} {...rest} />;
  //   }
  //   const y2 = (y0 + y1) / 2;
  //   const xOffset = dx > 0 ? 1 : 0;
  //   const minX = Math.min(x0, x1) - xOffset;
  //   const maxX = Math.max(x0, x1);
  //   return (
  //     <div className="stepped-line">
  //       <Line x0={x0} y0={y0} x1={x0} y1={y2} {...rest} />
  //       <Line x0={x1} y0={y1} x1={x1} y1={y2} {...rest} />
  //       <Line x0={minX} y0={y2} x1={maxX} y1={y2} {...rest} />
  //     </div>
  //   );
  // };

  const renderHorizontal = () => {
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

    const dy = to.y - from.y;
    if (dy === 0) {
      return <Line x0={x0} y0={y0} x1={x1} y1={y1} {...rest} />;
    }

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

  // switch (props.orientation) {
  //   case 'horizonal':
  //     return renderHorizontal();
  //   case 'vertical':
  //     return renderVertical();
  //   default:
  return renderHorizontal();
  // }
};

export default SteppedLine;
