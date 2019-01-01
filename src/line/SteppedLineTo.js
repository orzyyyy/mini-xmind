import React from 'react';
import LineTo from './LineTo';
import SteppedLine from './SteppedLine';
import omit from 'omit.js';

export default class SteppedLineTo extends LineTo {
  refresh = () => {
    this.setState({});
  };

  render() {
    const points = this.detect();
    const props = Object.assign(
      {},
      points,
      omit(this.props, ['fromAnchor', 'toAnchor']),
    );

    return points ? <SteppedLine {...props} /> : null;
  }
}
