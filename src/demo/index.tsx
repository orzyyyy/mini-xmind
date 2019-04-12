import React, { Component } from 'react';
import Canvas from '../canvas';
import mapping from '../mock/mapping.json';
import Toolbar from '../tools';
import './css/demo.css';

export interface CanvasPosition {
  x: number;
  y: number;
}
export interface BlockGroup {}
export interface TagGroup {}
export interface LineGroup {}

export interface DemoState {
  data: {
    CanvasPosition: CanvasPosition;
    BlockGroup: BlockGroup;
    TagGroup: TagGroup;
    LineGroup: LineGroup;
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

  handleChange = (data: any) => {
    this.setState({ data });
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
      </div>
    );
  };
}
