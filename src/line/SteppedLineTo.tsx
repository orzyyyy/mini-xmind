import React from 'react';
import LineTo from './LineTo';
import SteppedLine from './SteppedLine';

export default class SteppedLineTo extends LineTo {
  render = () => (
    <div className="stepped-line-to">
      <SteppedLine {...this.detect()} {...this.props} />
    </div>
  );
}
