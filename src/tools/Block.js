import React, { Component } from 'react';

import './assets/Block.css';

export default class Block extends Component {
  render() {
    const { top, left, color, className, children, ...rest } = this.props;
    return (
      <div className={`block ${className}`} {...rest}>
        {children}
      </div>
    );
  }
}
