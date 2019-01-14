import React, { Component } from 'react';

import Canvas from '../canvas';
import Toolbar from '../tools';
import { Button } from 'antd';
import mapping from '../mock/mapping.json';

import './assets/demo.css';

export default class Demo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: mapping,
    };
  }

  outputData = () => {
    const data = DataCollector.getAll();
    const treeData = JSON.stringify(data);
    // eslint-disable-next-line
    console.log(treeData);
  };

  render = () => {
    const { data } = this.state;

    return (
      <div className="Demo">
        <Toolbar />
        <Canvas className="canvas-wrapper" data={data} />
        <Button
          onClick={this.outputData}
          type="primary"
          style={{ position: 'absolute', top: 10, left: 10 }}
        >
          save
        </Button>
      </div>
    );
  };
}
