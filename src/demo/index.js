import React, { Component } from 'react';

import Canvas from '../canvas';
import Toolbar from '../tools';

import './assets/demo.css';

export default class Demo extends Component {
  outputData = () => {
    const data = DataCollector.getAll();
    const treeData = JSON.stringify(data);
    // eslint-disable-next-line
    console.log(treeData);
  };

  render = () => {
    return (
      <div className="Demo">
        <Toolbar />
        <Canvas className="canvas-wrapper" />
        <button onClick={this.outputData}>output</button>
      </div>
    );
  };
}
