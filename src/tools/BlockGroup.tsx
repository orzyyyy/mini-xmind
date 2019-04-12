import React, { Component } from 'react';
import classNames from 'classnames';
import Draggable from 'react-draggable';
import { generateKey, stopPropagation } from '../utils/LineUtil';
import PropTypes from 'prop-types';
import omit from 'omit.js';
import './css/BlockGroup.css';

// one Line is mapping to two Block
// to record it here
let mapping: any = {};
// to save refs
let blockDOM: any = {};
const getKeyLength = (obj: object) => Object.keys(obj).length;

const addBlockDom = (lineData: any, blockDOM: any) => {
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
  return lineData;
};

export interface BlockGroupProps {
  className?: string;
  data: { [blockKey: string]: { x: number; y: number } };
  lineData: {
    [lineKey: string]: {
      x: number;
      y: number;
      width: number;
      height: number;
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
  };
  onChange?: (data: any, lineData?: any) => void;
  offset?: { x: number; y: number };
}
export interface BlockGroupState {
  data?: any;
  lineData?: any;
}

export default class BlockGroup extends Component<
  BlockGroupProps,
  BlockGroupState
> {
  private checkBlockClickList: any;

  constructor(props: BlockGroupProps) {
    super(props);

    this.state = {
      data: {},
      lineData: {},
    };

    // for Line, two point create a line
    this.checkBlockClickList = {};
  }

  static getDerivedStateFromProps(nextProps: BlockGroupProps) {
    mapping = Object.assign({}, mapping, nextProps.lineData);
    return {
      data: nextProps.data,
      lineData: nextProps.lineData,
    };
  }

  static contextTypes = {
    getData: PropTypes.func,
  };

  componentDidUpdate = (prevProps: BlockGroupProps) => {
    const { lineData, onChange, data } = this.props;
    if (!lineData) {
      return;
    }
    const firstLine: any = Object.values(lineData)[0];
    const hasNewLine =
      getKeyLength(lineData) != getKeyLength(prevProps.lineData);
    if (!(firstLine && firstLine.from)) {
      if (hasNewLine || getKeyLength(lineData) != 0) {
        onChange && onChange(data, addBlockDom(lineData, blockDOM));
      }
    }
    // it's a hack
    // when dragging canvas, LineData can't update
    // add this to force update
    // so Line will be repainted instantly
    if (this.props.offset && prevProps.offset) {
      if (
        this.props.offset.x !== prevProps.offset.x ||
        this.props.offset.y !== prevProps.offset.y
      ) {
        onChange && onChange(data, addBlockDom(lineData, blockDOM));
      }
    }
  };

  handleDrag = ({ x, y }: { x: number; y: number }, blockKey: string) => {
    const { data, onChange, lineData } = this.props;
    data[blockKey] = Object.assign({}, data[blockKey], { x, y });
    onChange && onChange(data, addBlockDom(lineData, blockDOM));
  };

  // when Block clicked twice, generate a Line
  // and clean checkBlockClickList up
  handleBlockClick = (blockKey: string) => {
    let { checkBlockClickList } = this;
    let { onChange } = this.props;
    const { lineData, data } = this.state;
    const lineKey = generateKey('line');

    checkBlockClickList[blockKey] = { current: blockDOM[blockKey] };

    // to know which Block is starting point
    if (!('time' in checkBlockClickList[blockKey])) {
      checkBlockClickList[blockKey].time = new Date().getTime();
    }

    if (getKeyLength(checkBlockClickList) == 2) {
      if (!this.shouldPaintLine(checkBlockClickList, lineData)) {
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
      mapping[lineKey] = {
        fromKey,
        toKey,
      };
    }
  };

  generateLineData = (lineData: any, lineKey: string) => {
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

    return {
      result: lineData,
      ...common,
    };
  };

  saveBlock = (ref: HTMLDivElement | null, blockKey: string) => {
    if (ref) {
      blockDOM[blockKey] = ref.getBoundingClientRect();
    }
  };

  shouldPaintLine = (checkBlockClickList: any, linesProps: any) => {
    if (!getKeyLength(linesProps)) {
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

  handleDragStart = (e: any) => {
    stopPropagation(e);
  };

  render() {
    const { className: parentClassName, onChange, ...rest } = this.props;
    const { getData = function() {} } = this.context;
    const { data } = this.state;

    (window as any).DataCollector.set('BlockGroup', data);
    getData(data, 'BlockGroup');
    return Object.keys(data).map(blockKey => {
      const { x, y, className: blockClassName } = data[blockKey];
      return (
        <Draggable
          key={blockKey}
          position={{ x, y }}
          onDrag={(_, item) => this.handleDrag(item, blockKey)}
          onStart={this.handleDragStart}
        >
          <div
            className={classNames(
              'block-group',
              'animate-appear',
              parentClassName,
              blockClassName,
            )}
            onClick={() => this.handleBlockClick(blockKey)}
            ref={ref => this.saveBlock(ref, blockKey)}
            {...omit(rest, ['lineData'])}
          />
        </Draggable>
      );
    });
  }
}
