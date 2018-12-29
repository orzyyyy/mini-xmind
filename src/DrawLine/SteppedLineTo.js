import React from 'react';
import LineTo from './LineTo';
import SteppedLine from './SteppedLine';

export default class SteppedLineTo extends LineTo {
  render() {
    const points = this.detect();
    return points ? <SteppedLine {...points} {...this.props} /> : null;
  }
}
