import React from 'react';
import { SteppedLineTo } from '../line';

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
  orientation?: 'h' | 'v' | 'horizonal' | 'vertical' | string;
  className?: string;
}

const generateLines = ({ offset, data, ...rest }: LineGroupProps) => {
  return Object.keys(data).map(lineKey => {
    const { from, to } = data[lineKey];
    return (
      <SteppedLineTo
        from={from}
        to={to}
        key={lineKey}
        offset={offset}
        className="animate-appear"
        {...rest}
      />
    );
  });
};

const LineGroup = (props: LineGroupProps) => <>{generateLines(props)}</>;

export default LineGroup;
