import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Draggable from 'react-draggable';
import { SteppedLineTo } from '../Line';
import { getPlacement, preventDefault } from '../utils/LineUtil';
import Block from '../tools/Block';

export default class Canvas extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      toolInstance: [],
    };

    this.blocks = {};
    this.lineBlockList = []; // 用于连线，一般是两点一线
  }

  componentDidMount = () => {};

  saveBlock = (ref, blockKey) => {
    this.blocks[blockKey].current = ReactDOM.findDOMNode(ref);
  };

  onDrop = e => {
    let dragItem = e.dataTransfer.getData('dragItem');
    dragItem = dragItem ? JSON.parse(dragItem) : {};
    const { value, style } = dragItem;
    let { toolInstance } = this.state;
    const { clientX, clientY } = e;
    const blockKey = this.generateBlockKey();
    const x = clientX - style.width / 2;
    const y = clientY - style.height / 2;
    this.blocks[blockKey] = { x, y };

    switch (value) {
      case 'block':
        toolInstance.push(
          <Draggable
            onStop={this.handleStop}
            key={`border-${toolInstance.length + 1}`}
            // position={{ x: clientX - style.width / 2, y: clientY - style.height / 2 }}
          >
            <Block
              key={blockKey}
              style={Object.assign({}, style, {
                left: x,
                top: y,
              })}
              // onDrag={e => e && this.test.refresh()}
              onClick={e => this.handleBlockClick(blockKey)}
              ref={ref => this.saveBlock(ref, blockKey)}
            />
          </Draggable>,
        );
        break;

      case 'line':
        break;

      default:
        break;
    }
    this.setState({ toolInstance });
  };

  handleBlockClick = blockKey => {
    const { lineBlockList } = this;

    lineBlockList.push(blockKey);

    if (lineBlockList.length == 2) {
      let { toolInstance } = this.state;
      const fromNode = this.blocks[lineBlockList[0]];
      const toNode = this.blocks[lineBlockList[1]];
      const { fromAnchor, toAnchor } = getPlacement(fromNode, toNode);

      toolInstance.push(
        <SteppedLineTo
          from={fromNode.current}
          to={toNode.current}
          fromAnchor={fromAnchor}
          toAnchor={toAnchor}
          key={`stepLine-${blockKey}`}
        />,
      );
      this.lineBlockList = [];

      this.setState({ toolInstance });
    }
  };

  generateBlockKey = () => {
    return `block-${new Date().getTime() % 1000000}`;
  };

  render = () => {
    const { toolInstance } = this.state;
    const { ...rest } = this.props;

    return (
      <div
        className="Canvas"
        onDragOver={preventDefault}
        onDrop={this.onDrop}
        {...rest}
      >
        {toolInstance}
      </div>
    );
  };
}
