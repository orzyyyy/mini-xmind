import React, { Component } from 'react';

import Draggable from 'react-draggable';
import { SteppedLineTo, Block } from '../DrawLine';
import { getPlacement, preventDefault } from '../utils/LineUtil';

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

  onDrop = e => {
    let dragItem = e.dataTransfer.getData('dragItem');
    dragItem = dragItem ? JSON.parse(dragItem) : {};
    const { value, style } = dragItem;
    let { toolInstance, lineActive } = this.state;
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
            disabled={lineActive}
            onDrag={e => this.test.refresh()}
            // position={{ x: clientX - style.width / 2, y: clientY - style.height / 2 }}
          >
            <Block
              className={blockKey}
              key={blockKey}
              style={Object.assign({}, style, {
                left: x,
                top: y,
                position: 'absolute',
              })}
              onClick={e => this.handleBlockClick(blockKey)}
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
      const { from, to } = getPlacement(
        this.blocks[lineBlockList[0]],
        this.blocks[lineBlockList[1]],
      );

      toolInstance.push(
        <SteppedLineTo
          from={lineBlockList[0]}
          to={lineBlockList[1]}
          fromAnchor={from}
          toAnchor={to}
          ref={ref => (this.test = ref)}
        />,
      );
      this.lineBlockList = [];

      this.setState({ toolInstance });
    }
  };

  generateBlockKey = () => {
    return new Date().getTime();
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
