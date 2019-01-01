import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classNames';

import Draggable from 'react-draggable';
import { SteppedLineTo } from '../Line';
import { getPlacement, preventDefault } from '../utils/LineUtil';
import Block from '../tools/Block';

export default class Canvas extends Component {
  static propTypes = {
    style: PropTypes.object,
    className: PropTypes.string,
  };

  static defaultProps = {
    style: {},
    className: '',
  };

  constructor(props) {
    super(props);

    this.state = {
      toolInstance: [],
      blocks: {},
    };

    this.lineBlockList = []; // for Line, two point create a line
  }

  componentDidMount = () => {};

  saveBlock = (ref, blockKey) => {
    let { blocks } = this.state;

    blocks[blockKey].current = ReactDOM.findDOMNode(ref);

    this.setState({ blocks });
  };

  handleStop = ({ x, y }, blockKey) => {
    const { blocks } = this.state;

    blocks[blockKey] = Object.assign({}, blocks[blockKey], { x, y });

    this.setState({ blocks });
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
    this.state.blocks[blockKey] = { x, y };

    switch (value) {
      case 'block':
        toolInstance.push(
          <Draggable
            onStop={(e, item) => this.handleStop(item, blockKey)}
            key={blockKey}
            position={{ x, y }}
          >
            <Block
              style={style}
              // style={Object.assign({}, style, {
              //   left: x,
              //   top: y,
              // })}
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
    let { lineBlockList } = this;

    lineBlockList.push(blockKey);

    if (lineBlockList.length == 2) {
      let { toolInstance } = this.state;
      const fromNode = this.state.blocks[lineBlockList[0]];
      const toNode = this.state.blocks[lineBlockList[1]];
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
      lineBlockList = [];

      this.setState({ toolInstance });
    }
  };

  generateBlockKey = () => {
    return `block-${new Date().getTime() % 1000000}`;
  };

  render = () => {
    const { className, ...rest } = this.props;
    const { toolInstance, blocks } = this.state;

    return (
      <div
        className={classNames('Canvas', className)}
        onDragOver={preventDefault}
        onDrop={this.onDrop}
        {...rest}
      >
        {toolInstance}
      </div>
    );
  };
}
