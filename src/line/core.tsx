import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const defaultBorderColor = '#ddd';
const defaultBorderStyle = 'solid';
const defaultBorderWidth = 1;

export default class Line extends PureComponent {
  static propTypes = {
    x0: PropTypes.number.isRequired,
    y0: PropTypes.number.isRequired,
    x1: PropTypes.number.isRequired,
    y1: PropTypes.number.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
  };

  static defaultProps = {
    className: '',
    style: {},
    x0: 0,
    y0: 0,
    x1: 0,
    y1: 0,
  };

  render() {
    const { x0, y0, x1, y1, style, zIndex, className, ...rest } = this.props;

    const dy = y1 - y0;
    const dx = x1 - x0;

    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    const length = Math.sqrt(dx * dx + dy * dy);

    const positionStyle = {
      position: 'absolute',
      top: `${y0}px`,
      left: `${x0}px`,
      width: `${length}px`,
      zIndex: Number.isFinite(zIndex) ? String(zIndex) : '1',
      transform: `rotate(${angle}deg)`,
      // Rotate around (x0, y0)
      transformOrigin: '0 0',
    };

    const defaultStyle = {
      borderTopColor: defaultBorderColor,
      borderTopStyle: defaultBorderStyle,
      borderTopWidth: defaultBorderWidth,
    };

    const props = {
      className,
      style: Object.assign({}, defaultStyle, positionStyle, style),
    };

    return (
      <div className="line-placeholder">
        <div ref={el => (this.el = el)} {...rest} {...props} />
      </div>
    );
  }
}
