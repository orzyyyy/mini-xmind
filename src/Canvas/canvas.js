import React, { Component } from 'react';

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
      const { fromAnchor, toAnchor } = getPlacement(
        this.blocks[lineBlockList[0]],
        this.blocks[lineBlockList[1]],
      );

      toolInstance.push(
        <SteppedLineTo
          // https://stackoverflow.com/questions/46984544/redux-form-invalid-prop-value-of-type-number-supplied-to-textinput-expec
          from={`${lineBlockList[0]}`}
          to={`${lineBlockList[1]}`}
          fromAnchor={fromAnchor}
          toAnchor={toAnchor}
          ref={ref => (this.test = ref)}
          key={`stepLine-${blockKey}`}
        />,
      );
      this.lineBlockList = [];

      this.setState({ toolInstance });
    }
  };

  generateBlockKey = () => {
    return new Date().getTime() % 1000000;
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
