import React from 'react';
import SteppedLine, { OrientationProps } from '../line/SteppedLine';
import { CoordinatesProps } from '../canvas/core';

export type LineItem =
  | {
      x: number;
      y: number;
      bottom: number;
      height: number;
      left: number;
      right: number;
      top: number;
      width: number;
    }
  | DOMRect;
export type LineProps = {
  [key: string]: {
    fromKey: string;
    toKey: string;
    from: LineItem;
    to: LineItem;
  };
};
export interface LineGroupProps {
  offset?: CoordinatesProps;
  data: LineProps;
  orientation?: OrientationProps;
  className?: string;
  arrowStatus?: [boolean, boolean, boolean];
}

const LineGroup = ({ offset, data, ...rest }: LineGroupProps) => (
  <>
    {Object.keys(data).map(lineKey => {
      const { from, to } = data[lineKey];
      return (
        <SteppedLine
          from={from}
          to={to}
          key={lineKey}
          offset={offset}
          className="animate-appear"
          {...rest}
        />
      );
    })}
  </>
);

export default LineGroup;
