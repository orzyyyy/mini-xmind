import React, { Component } from 'react';
import Canvas from '../canvas';
import mapping from '../mock/mapping.json';
import Toolbar from '../tools';
import { Button } from 'antd';
import './assets/demo.css';

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
    if (window.fetch) {
      fetch('../mock/mapping.json')
        .then(result => result.json())
        .then(data => this.setState({ data }));
    } else {
      this.setState({ data: mapping });
    }
  };

  outputData = () => {
    const data = (window as any).DataCollector.getAll();
    this.setState({ data });
    const treeData = JSON.stringify(data);
    // eslint-disable-next-line
    console.log(treeData);
    return data;
  };

  render = () => {
    const { data } = this.state;

    return (
      <div className="Demo">
        <Toolbar />
        <Canvas
          className="canvas-wrapper"
          data={data}
          tagClassName="tag-default"
        />
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
