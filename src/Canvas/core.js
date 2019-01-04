import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Draggable from 'react-draggable';
import { SteppedLineTo } from '../line';
import {
  getPlacement,
  preventDefault,
  generateKey,
  getRelativeLinesByBlockKey,
} from '../utils/LineUtil';
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
      linesProps: {},
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
    if (!dragItem) {
      return;
    }
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
  handleBlockDrag = ({ x, y, width, height }, blockKey) => {
    let { state, blockDOM } = this;
    const { linesProps, blockProps } = state;
    const relativeLines = getRelativeLinesByBlockKey(blockKey, this.mapping);

    blockProps[blockKey].x = x;
    blockProps[blockKey].y = y;

    // Line should change anchor automatically
    for (let key of relativeLines) {
      const item = linesProps[key];
      const { fromKey, toKey } = item;
      const { fromAnchor, toAnchor } = getPlacement(
        blockDOM[fromKey],
        blockDOM[toKey],
        width,
        height,
      );

      item.fromAnchor = fromAnchor;
      item.toAnchor = toAnchor;
    }

    this.setState({ linesProps, blockProps });
  };

  shouldPaintLine = (mapping, checkBlockClickList, linesProps) => {
    if (!Object.keys(linesProps).length) {
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
    let { linesProps } = this.state;

    checkBlockClickList[blockKey] = { current: blockDOM[blockKey] };

    // to know which Block is starting point
    if (!('time' in checkBlockClickList[blockKey])) {
      checkBlockClickList[blockKey].time = new Date().getTime();
    }

    if (Object.keys(checkBlockClickList).length == 2) {
      if (
        !this.shouldPaintLine(this.mapping, checkBlockClickList, linesProps)
      ) {
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
        blockProps[fromKey].style.width,
        blockProps[fromKey].style.height,
      );

      linesProps[lineKey] = {
        from: fromNode,
        key: lineKey,
        to: toNode,
        fromAnchor,
        toAnchor,
        fromKey,
        toKey,
      };

      this.setState({ linesProps }, () => {
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
      const { width, height } = style;

      return (
        <Draggable
          onStop={(e, item) => this.handleStop(item, blockKey)}
          key={blockKey}
          position={{ x, y }}
          onDrag={(e, item) =>
            this.handleBlockDrag(
              { x: item.x, y: item.y, width, height },
              blockKey,
            )
          }
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

  generateLines = linesProps => {
    return Object.keys(linesProps).map(lineKey => {
      const { from, to, key, fromAnchor, toAnchor, orientation } = linesProps[
        lineKey
      ];

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
    const { blockProps, linesProps } = this.state;

    return (
      <div
        className={classNames('Canvas', className)}
        onDragOver={preventDefault}
        onDrop={this.onDrop}
        {...rest}
      >
        {this.generateBlocks(blockProps)}
        {this.generateLines(linesProps)}
      </div>
    );
  };
}
