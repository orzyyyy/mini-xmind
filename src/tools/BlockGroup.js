import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';
import { noop } from '../utils/commonUtil';
import { generateKey } from '../utils/LineUtil';

import './assets/BlockGroup.css';

export default class Block extends Component {
  static propTypes = {
    className: PropTypes.string,
    data: PropTypes.object,
    lineData: PropTypes.object,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    className: '',
    data: {},
    lineData: {},
    onChange: noop,
  };

  constructor(props) {
    super(props);

    // for Line, two point create a line
    this.checkBlockClickList = {};
    this.blockDOM = {};
    // one Line is mapping to two Block
    // to record it here
    this.mapping = {};
  }

  handleStop = ({ x, y }, blockKey) => {
    const { data, onChange } = this.props;

    data[blockKey] = Object.assign({}, data[blockKey], { x, y });

    onChange && onChange(data);
  };

  // when Block clicked twice, generate a Line
  // and clear checkBlockClickList
  handleBlockClick = blockKey => {
    let { checkBlockClickList, blockDOM } = this;
    let { lineData, onChange, data } = this.props;

    checkBlockClickList[blockKey] = { current: blockDOM[blockKey] };

    // to know which Block is starting point
    if (!('time' in checkBlockClickList[blockKey])) {
      checkBlockClickList[blockKey].time = new Date().getTime();
    }

    if (Object.keys(checkBlockClickList).length == 2) {
      if (!this.shouldPaintLine(this.mapping, checkBlockClickList, lineData)) {
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

      lineData[lineKey] = {
        from: fromNode,
        key: lineKey,
        to: toNode,
        fromKey,
        toKey,
      };

      onChange && onChange(data, lineData);

      this.checkBlockClickList = {};
      // record mapping for arrow
      this.mapping[lineKey] = {
        fromKey,
        toKey,
      };
    }
  };

  saveBlock = (ref, blockKey) => {
    this.blockDOM[blockKey] = ReactDOM.findDOMNode(ref);
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

  render() {
    const { className, onChange, data, ...rest } = this.props;

    return Object.keys(data).map(blockKey => {
      const { x, y, style } = data[blockKey];
      return (
        <Draggable
          onStop={(e, item) => this.handleStop(item, blockKey)}
          key={blockKey}
          position={{ x, y }}
          onDrag={e => onChange && onChange(data)}
        >
          <div
            className={classNames('BlockGroup', className)}
            onClick={e => this.handleBlockClick(blockKey)}
            ref={ref => this.saveBlock(ref, blockKey)}
            style={style}
            {...rest}
          />
        </Draggable>
      );
    });
  }
}
