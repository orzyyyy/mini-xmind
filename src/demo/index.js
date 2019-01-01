import React, { Component } from 'react';

import { ToolBar, Canvas } from '../Canvas';

import './assets/demo.css';

export default class Demo extends Component {
  render = () => {
    return (
      <div className="Demo">
        <ToolBar />
        <Canvas style={{ width: '100%', height: '100%' }} />
      </div>
    );
  };
}
