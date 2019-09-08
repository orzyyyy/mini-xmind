import React from 'react';
import SteppedLine, { OrientationProps } from '../line/SteppedLine';

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
  offset?: { x: number; y: number };
  data: LineProps;
  orientation?: OrientationProps;
  className?: string;
}

const LineGroup = ({ offset, data, ...rest }: LineGroupProps) => {
  return (
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
};

export default LineGroup;
