import React, { Component } from 'react';

import Canvas from '../Canvas';
import Toolbar, { Block } from '../tools';

import './assets/demo.css';

export default class Demo extends Component {
  render = () => {
    return (
      <div className="Demo">
        <Toolbar />
        <Canvas className="canvas-wrapper" />
      </div>
    );
  };
}
