import React, { Component } from 'react';
import Canvas from '../canvas';
import mapping from '../mock/mapping.json';
import Toolbar from '../tools';
import './css/demo.css';

export interface CanvasPosition {
  x: number;
  y: number;
}
export interface DemoState {
  data: {
    CanvasPosition: CanvasPosition;
    BlockGroup: any;
    TagGroup: any;
    LineGroup: any;
  };
}

export default class Demo extends Component<any, DemoState> {
  constructor(props: any) {
    super(props);

    this.state = {
      data: {
        CanvasPosition: { x: 0, y: 0 },
        BlockGroup: {},
        TagGroup: {},
        LineGroup: {},
      },
    };
  }

  componentDidMount = () => {
    this.setState({ data: mapping });
  };

  outputData = () => {
    const data = (window as any).DataCollector.getAll();
    this.setState({ data });
    const treeData = JSON.stringify(data);
    // eslint-disable-next-line
    console.log(treeData);
    return data;
  };

  handleChange = (data: any) => {
    console.log(data);
  };

  render = () => {
    const { data } = this.state;

    return (
      <div className="Demo">
        <Toolbar />
        <Canvas
          className="canvas-wrapper"
          data={data}
          onChange={this.handleChange}
        />
        <button
          onClick={this.outputData}
          style={{ position: 'absolute', top: 10, left: 10 }}
        >
          save
        </button>
      </div>
    );
  };
}
