import React, { Component } from 'react';
import Canvas from '../canvas';
import mapping from '../mock/mapping.json';
import Toolbar from '../tools';
import './css/demo.css';

export default class Demo extends Component {
  state = { data: {} };

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

  handleWhellChange = (data: any, e: any) => {
    const { z, gap } = data.CanvasPosition;
    if (e.deltaY < 0) {
      // scrolling up
      data.CanvasPosition.z = z + gap;
    } else if (e.deltaY > 0) {
      // scrolling down
      data.CanvasPosition.z = z - gap;
    }
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
