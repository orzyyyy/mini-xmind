import React, { Component } from 'react';
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
  data?: LineProps;
  orientation?: 'h' | 'v' | 'horizonal' | 'vertical' | string;
  className?: string;
}
export interface LineGroupState {
  data?: any;
}

export default class LineGroup extends Component<
  LineGroupProps,
  LineGroupState
> {
  static defaultProps = {
    offset: {},
    data: {},
  };

  static getDerivedStateFromProps(nextProps: LineGroupProps) {
    const data = nextProps.data || {};
    const newState: any = {};
    for (const key of Object.keys(data)) {
      const { from, to } = data[key];

      if (from && to) {
        newState[key] = data[key];
      } else {
        break;
      }
    }

    return { data: newState };
  }

  constructor(props: LineGroupProps) {
    super(props);

    this.state = {
      data: {},
    };
  }

  generateLines = (data: any) => {
    const { offset, ...rest } = this.props;
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

  render = () => {
    const { data } = this.state;

    if (Object.keys(data).length === 0) {
      return null;
    }

    return <div className="LineGroup">{this.generateLines(data)}</div>;
  };
}
