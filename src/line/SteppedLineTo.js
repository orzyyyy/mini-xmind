import React from 'react';
import LineTo from './LineTo';
import SteppedLine from './SteppedLine';
import omit from 'omit.js';
import classNames from 'classnames';

export default class SteppedLineTo extends LineTo {
  refresh = () => {
    this.setState({});
  };

  render() {
    const { className } = this.props;
    const points = this.detect();
    const props = Object.assign(
      {},
      points,
      omit(this.props, ['fromAnchor', 'toAnchor']),
    );

    return (
      <div className={classNames('stepped-line-to', className)}>
        {points ? <SteppedLine {...props} /> : null}
      </div>
    );
  }
}
