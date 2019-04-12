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

  debounce = (fun: any, delay: number) => (args: any) => {
    clearTimeout(fun.id);
    fun.id = setTimeout(function() {
      fun.call(this, args);
    }, delay);
  };

  handleChange = (data: any) => {
    this.debounce(this.useDebounce, 1000)(data);
    this.setState({ data });
  };

  useDebounce(data: any) {
    console.log(data);
  }

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
