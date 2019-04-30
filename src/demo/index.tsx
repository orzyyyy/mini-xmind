import React, { Component } from 'react';
import Canvas, { DataSource } from '../canvas';
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
  data: DataSource;
}

export default class Demo extends Component<any, DemoState> {
  state: DemoState = {
    data: {
      CanvasPosition: { x: 0, y: 0, z: 0, gap: 1 },
      BlockGroup: {},
      TagGroup: {},
      LineGroup: {},
    },
  };

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
    // tslint:disable-next-line
    console.log(data);
  }

  handleWhellChange = (data: any) => {
    // tslint:disable-next-line
    console.log(data);
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
          onWheel={this.handleWhellChange}
        />
      </div>
    );
  };
}
