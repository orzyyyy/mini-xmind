import React, { Component } from 'react';

import './assets/Block.css';

export default class Block extends Component {
  render() {
    const { top, left, color, className } = this.props;
    const style = { top, left, backgroundColor: color };
    return (
      <div
        className={`block ${className}`}
        style={style}
        onMouseOver={this.props.onMouseOver}
        onMouseOut={this.props.onMouseOut}
      >
        {this.props.children}
      </div>
    );
  }
}
