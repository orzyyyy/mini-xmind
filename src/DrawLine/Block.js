import React, { Component } from 'react';

import './assets/Block.css';

export default class Block extends Component {
  render() {
    const { top, left, color, className, ...rest } = this.props;
    return (
      <div className={`block ${className}`} {...rest}>
        {this.props.children}
      </div>
    );
  }
}
