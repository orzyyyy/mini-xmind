import React, { Component } from 'react';
import Line from './core';

const defaultAnchor = { x: 0.5, y: 0.5 };
export function parseAnchor(value: string | undefined) {
  if (!value) {
    return defaultAnchor;
  }
  const parts = value.split(' ');
  if (parts.length > 2) {
    return 'LinkTo anchor format is "<x> <y>"';
  }
  const [x, y] = parts;
  return Object.assign(
    {},
    defaultAnchor,
    x ? parseAnchorText(x) || { x: parseAnchorPercent(x) } : {},
    y ? parseAnchorText(y) || { y: parseAnchorPercent(y) } : {},
  );
}

export function parseAnchorText(value: string) {
  // Try to infer the relevant axis.
  switch (value) {
    case 'top':
      return { y: 0 };
    case 'left':
      return { x: 0 };
    case 'middle':
      return { y: 0.5 };
    case 'center':
      return { x: 0.5 };
    case 'bottom':
      return { y: 1 };
    case 'right':
      return { x: 1 };
  }
  return null;
}

export function parseAnchorPercent(value: string) {
  const percent = parseFloat(value) / 100;
  if (isNaN(percent) || !isFinite(percent)) {
    return `LinkTo could not parse percent value: ${value}`;
  }
  return percent;
}

export interface LineToProps {
  className?: string;
  style?: any;
  from: any;
  to: any;
  fromAnchor?: string;
  toAnchor?: string;
  offset?: { x: number; y: number };
  orientation?: 'h' | 'v' | 'horizonal' | 'vertical' | string;
}
export interface LineToState {
  offsetX: number;
  offsetY: number;
}

export default class LineTo extends Component<LineToProps, LineToState> {
  state = {
    offsetX: 0,
    offsetY: 0,
  };

  static defaultProps = {
    className: '',
    style: {},
    offset: { x: 0, y: 0 },
  };

  static getDerivedStateFromProps(
    nextProps: LineToProps,
    nextState: LineToState,
  ) {
    const { offset: parentOffset } = nextProps;
    if (
      parentOffset &&
      (parentOffset.x !== nextState.offsetX ||
        parentOffset.y !== nextState.offsetY)
    ) {
      return { offsetX: parentOffset.x, offsetY: parentOffset.y };
    }
    return null;
  }

  detect = () => {
    const { from, to, offset = { x: 0, y: 0 } } = this.props;

    const offsetX = window.pageXOffset - offset.x;
    const offsetY = window.pageYOffset - offset.y;

    const x0 = from.left + from.width * defaultAnchor.x + offsetX;
    const x1 = to.left + to.width * defaultAnchor.x + offsetX;
    const y0 = from.top + from.height * defaultAnchor.y + offsetY;
    const y1 = to.top + to.height * defaultAnchor.y + offsetY;

    return { x0, y0, x1, y1 };
  };

  render = () => {
    return <Line {...this.detect()} {...this.props} />;
  };
}
