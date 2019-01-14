import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';
import { noop } from '../utils/commonUtil';
import { generateKey } from '../utils/LineUtil';
import omit from 'omit.js';

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

    this.state = {
      data: {},
      lineData: {},
    };

    // for Line, two point create a line
    this.checkBlockClickList = {};
    this.blockDOM = {};
    // one Line is mapping to two Block
    // to record it here
    this.mapping = {};
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    const { data, onChange } = nextProps;

    if (
      Object.keys(nextProps.lineData).length !=
      Object.keys(nextState.lineData).length
    ) {
      onChange && onChange(data, nextProps.lineData);
    }

    return {
      data,
      lineData: nextProps.lineData,
    };
  }

  componentDidMount = () => {
    const { blockDOM, props } = this;
    const { lineData } = props;
    for (let key in lineData) {
      const { fromKey, toKey } = lineData[key];

      for (let blockKey in blockDOM) {
        const value = blockDOM[blockKey];

        if (fromKey == blockKey) {
          lineData[key].from = value;
        }

        if (toKey == blockKey) {
          lineData[key].to = value;
        }
      }
    }
  };

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
    const lineKey = generateKey('line');

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

      const { result, fromKey, toKey } = this.generateLineData(
        lineData,
        lineKey,
      );
      onChange && onChange(data, result);

      this.checkBlockClickList = {};
      // record mapping for arrow
      this.mapping[lineKey] = {
        fromKey,
        toKey,
      };
    }
  };

  generateLineData = (lineData, lineKey) => {
    const { checkBlockClickList } = this;
    let fromNode, toNode, fromKey, toKey;
    const keys = Object.keys(checkBlockClickList);

    if (checkBlockClickList[keys[0]] > checkBlockClickList[keys[1]]) {
      fromKey = keys[1];
      toKey = keys[0];
    } else {
      fromKey = keys[0];
      toKey = keys[1];
    }

    fromNode = checkBlockClickList[fromKey].current;
    toNode = checkBlockClickList[toKey].current;

    const common = {
      fromKey,
      toKey,
    };
    lineData[lineKey] = {
      ...common,
      from: fromNode,
      to: toNode,
    };

    return lineData;
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
    const { className, onChange, ...rest } = this.props;
    const { data } = this.state;

    DataCollector.set('BlockGroup', data);
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
            className={classNames('BlockGroup', 'animate-appear', className)}
            onClick={e => this.handleBlockClick(blockKey)}
            ref={ref => this.saveBlock(ref, blockKey)}
            style={style}
            {...omit(rest, ['lineData'])}
          />
        </Draggable>
      );
    });
  }
}
