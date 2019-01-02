import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classNames';

import Draggable from 'react-draggable';
import { SteppedLineTo } from '../Line';
import { getPlacement, preventDefault, generateKey } from '../utils/LineUtil';
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
      blockProps: {},
      lines: {},
    };

    // for Line, two point create a line
    this.checkBlockClickList = {};
    this.blockDOM = {};
    // one Line is mapping to two Block
    // to record it here
    this.mapping = {};
  }

  saveBlock = (ref, blockKey) => {
    this.blockDOM[blockKey] = ReactDOM.findDOMNode(ref);
  };

  handleStop = ({ x, y }, blockKey) => {
    const { blockProps } = this.state;

    blockProps[blockKey] = Object.assign({}, blockProps[blockKey], { x, y });

    this.setState({ blockProps });
  };

  onDrop = e => {
    let dragItem = e.dataTransfer.getData('dragItem');
    dragItem = dragItem ? JSON.parse(dragItem) : {};
    const { value, style } = dragItem;
    let { blockProps } = this.state;
    const { clientX, clientY } = e;
    const blockKey = generateKey('block');
    const x = clientX - style.width / 2;
    const y = clientY - style.height / 2;

    switch (value) {
      case 'block':
        blockProps[blockKey] = { x, y, style };
        break;

      case 'line':
        break;

      default:
        break;
    }
    this.setState({ blockProps });
  };

  // to repaint Line instantly
  handleBlockDrag = () => {
    this.setState({});
  };

  shouldPaintLine = (mapping, checkBlockClickList, lines) => {
    if (!Object.keys(lines).length) {
      return true;
    }

    const blocks = Object.keys(checkBlockClickList).toString();
    for (let key of Object.keys(mapping)) {
      let fromFlag = false,
        toFlag = false;
      const { fromKey, toKey } = mapping[key];

      if (blocks.includes(fromKey)) {
        fromFlag = true;
      }

      if (blocks.includes(toKey)) {
        toFlag = true;
      }

      if (fromFlag && toFlag) {
        return false;
      }
    }

    return true;
  };

  // when Block clicked twice, generate a Line
  // and clear checkBlockClickList
  handleBlockClick = blockKey => {
    let { checkBlockClickList, blockDOM } = this;
    const { blockProps } = this.state;
    let { lines } = this.state;

    checkBlockClickList[blockKey] = { current: blockDOM[blockKey] };

    // to know which Block is starting point
    if (!('time' in checkBlockClickList[blockKey])) {
      checkBlockClickList[blockKey].time = new Date().getTime();
    }

    if (Object.keys(checkBlockClickList).length == 2) {
      if (!this.shouldPaintLine(this.mapping, checkBlockClickList, lines)) {
        this.checkBlockClickList = {};
        return;
      }

      let fromNode, toNode, fromKey, toKey;
      const keys = Object.keys(checkBlockClickList);
      const lineKey = generateKey('line');

      if (checkBlockClickList[keys[0]] > checkBlockClickList[keys[1]]) {
        fromKey = keys[1];
        toKey = keys[0];
      } else {
        fromKey = keys[0];
        toKey = keys[1];
      }

      fromNode = checkBlockClickList[fromKey].current;
      toNode = checkBlockClickList[toKey].current;

      const { fromAnchor, toAnchor } = getPlacement(
        blockProps[fromKey],
        blockProps[toKey],
      );

      lines[lineKey] = {
        from: fromNode,
        to: toNode,
        fromAnchor,
        toAnchor,
        key: lineKey,
      };

      this.setState({ lines }, () => {
        this.checkBlockClickList = {};
        // record mapping for arrow
        this.mapping[lineKey] = {
          fromKey,
          toKey,
        };
      });
    }
  };

  generateBlocks = blockProps => {
    return Object.keys(blockProps).map(blockKey => {
      const { x, y, style } = blockProps[blockKey];

      return (
        <Draggable
          onStop={(e, item) => this.handleStop(item, blockKey)}
          key={blockKey}
          position={{ x, y }}
          onDrag={this.handleBlockDrag}
        >
          <Block
            style={style}
            onClick={e => this.handleBlockClick(blockKey)}
            ref={ref => this.saveBlock(ref, blockKey)}
          />
        </Draggable>
      );
    });
  };

  generateLines = lines => {
    return Object.keys(lines).map(lineKey => {
      const { from, to, key, fromAnchor, toAnchor } = lines[lineKey];

      return (
        <SteppedLineTo
          from={from}
          to={to}
          fromAnchor={fromAnchor}
          toAnchor={toAnchor}
          key={key}
        />
      );
    });
  };

  render = () => {
    const { className, ...rest } = this.props;
    const { blockProps, lines } = this.state;

    return (
      <div
        className={classNames('Canvas', className)}
        onDragOver={preventDefault}
        onDrop={this.onDrop}
        {...rest}
      >
        {this.generateBlocks(blockProps)}
        {this.generateLines(lines)}
      </div>
    );
  };
}
