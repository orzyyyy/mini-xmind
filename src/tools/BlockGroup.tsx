import React, { Component } from 'react';
import classNames from 'classnames';
import Draggable from 'react-draggable';
import { generateKey, stopPropagation } from '../utils/LineUtil';
import './css/BlockGroup.css';
import { ContextMenuProps } from '../canvas/core';

// one Line is mapping to two Block
// to record it here
let mapping: any = {};
// to save refs
const blockDOM: any = {};
const keysLength = (obj: object) => Object.keys(obj).length;

const addBlockDom = (lineData: any, targetBlockDOM: any) => {
  for (const key of Object.keys(lineData || {})) {
    const { fromKey, toKey } = lineData[key];
    for (const blockKey of Object.keys(targetBlockDOM)) {
      const value = targetBlockDOM[blockKey];

      if (fromKey === blockKey) {
        lineData[key].from = value;
      }

      if (toKey === blockKey) {
        lineData[key].to = value;
      }
    }
  }
  return lineData;
};

export type BlockProps = { [blockKey: string]: { x: number; y: number } };
export interface BlockGroupProps {
  className?: string;
  data?: BlockProps;
  lineData?: any;
  onChange?: (data: any, lineData?: any) => void;
  offset?: { x: number; y: number };
  onContextMenu?: (item: ContextMenuProps) => void;
  renderLine?: (lineData: any) => void;
}
export interface BlockGroupState {
  data?: any;
  lineData?: any;
}

export default class BlockGroup extends Component<
  BlockGroupProps,
  BlockGroupState
> {
  static getDerivedStateFromProps(nextProps: BlockGroupProps) {
    mapping = Object.assign({}, mapping, nextProps.lineData);
    return {
      data: nextProps.data,
      lineData: nextProps.lineData,
    };
  }

  state: BlockGroupState = {
    data: {},
    lineData: {},
  };

  private checkBlockClickList: any = {};

  componentDidUpdate = (prevProps: BlockGroupProps) => {
    const { lineData, onChange, data } = this.props;
    if (keysLength(lineData) === 0) {
      return;
    }
    const firstLine: any = Object.values(lineData)[0];
    const hasNewLine =
      keysLength(lineData) !== keysLength(prevProps.lineData || {});
    if (!(firstLine && firstLine.from)) {
      if (hasNewLine || keysLength(lineData) !== 0) {
        if (onChange) {
          onChange(data, addBlockDom(lineData, blockDOM));
        }
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
        if (onChange) {
          onChange(data, addBlockDom(lineData, blockDOM));
        }
      }
    }
  };

  handleDrag = ({ x, y }: { x: number; y: number }, blockKey: string) => {
    const { data, onChange, lineData } = this.props;
    if (data) {
      data[blockKey] = Object.assign({}, data[blockKey], { x, y });
    }
    if (onChange) {
      onChange(data, addBlockDom(lineData, blockDOM));
    }
  };

  // when Block clicked twice, generate a Line
  // and clear checkBlockClickList
  handleBlockClick = (blockKey: string) => {
    const { checkBlockClickList } = this;
    const { onChange } = this.props;
    const { lineData, data } = this.state;
    const lineKey = generateKey('line');

    checkBlockClickList[blockKey] = { current: blockDOM[blockKey] };

    // to know which Block is starting point
    if (!('time' in checkBlockClickList[blockKey])) {
      checkBlockClickList[blockKey].time = new Date().getTime();
    }

    if (keysLength(checkBlockClickList) === 2) {
      if (!this.shouldPaintLine(checkBlockClickList, lineData)) {
        this.checkBlockClickList = {};
        return;
      }

      const { result, fromKey, toKey } = this.generateLineData(
        lineData,
        lineKey,
      );

      if (onChange) {
        onChange(data, result);
      }

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
    let fromNode;
    let toNode;
    let fromKey;
    let toKey;
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
    if (!keysLength(linesProps)) {
      return true;
    }

    const blocks = Object.keys(checkBlockClickList).toString();
    for (const key of Object.keys(mapping)) {
      let fromFlag = false;
      let toFlag = false;
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
    const {
      className: parentClassName,
      onChange,
      onContextMenu,
      renderLine,
      lineData,
      ...rest
    } = this.props;
    const { data } = this.state;

    return (
      <>
        {Object.keys(data).map(blockKey => {
          const { x, y, className: blockClassName } = data[blockKey];
          return (
            <React.Fragment key={blockKey}>
              <Draggable
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
                  onClick={_ => this.handleBlockClick(blockKey)}
                  ref={ref => this.saveBlock(ref, blockKey)}
                  onContextMenu={(e: any) => {
                    if (onContextMenu) {
                      onContextMenu({
                        event: e,
                        key: blockKey,
                        group: 'BlockGroup',
                      });
                    }
                  }}
                  {...rest}
                />
              </Draggable>
            </React.Fragment>
          );
        })}
        {renderLine && renderLine(addBlockDom(lineData, blockDOM))}
      </>
    );
  }
}
