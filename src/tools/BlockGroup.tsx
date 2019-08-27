import React from 'react';
import classNames from 'classnames';
import Draggable from 'react-draggable';
import {
  generateKey,
  stopPropagation,
  preventDefault,
} from '../utils/LineUtil';
import './css/BlockGroup.css';
import { ContextMenuProps } from '../canvas/core';

export type BlockProps = { [blockKey: string]: { x: number; y: number } };
export interface BlockGroupProps {
  className?: string;
  data: BlockProps;
  lineData?: any;
  onChange?: (data: any, lineData?: any) => void;
  offset?: { x: number; y: number };
  onContextMenu?: (item: ContextMenuProps) => void;
  renderLine: (lineData: any) => void;
}
export interface BlockGroupState {
  data?: any;
  lineData?: any;
}

let checkBlockClickList: any = {};
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

export const cleanCheckBlockClickList = () => {
  checkBlockClickList = {};
};

const generateLineData = (lineData: any, lineKey: string) => {
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

export const shouldPaintLine = (checkBlockClickList: any, linesProps: any) => {
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

const handleDragStart = (e: any) => {
  stopPropagation(e);
  preventDefault(e);
};

const BlockGroup = ({
  className: parentClassName,
  onChange,
  onContextMenu,
  renderLine,
  lineData,
  data,
  ...rest
}: BlockGroupProps) => {
  const handleDrag = ({ x, y }: { x: number; y: number }, blockKey: string) => {
    if (onChange) {
      onChange(
        Object.assign({}, data, { [blockKey]: { x, y } }),
        addBlockDom(lineData, blockDOM),
      );
    }
  };

  // when Block clicked twice, generate a Line
  // and clear checkBlockClickList
  const handleBlockClick = (blockKey: string) => {
    const lineKey = generateKey('line');

    checkBlockClickList[blockKey] = { current: blockDOM[blockKey] };

    // to know which Block is starting point
    if (!('time' in checkBlockClickList[blockKey])) {
      checkBlockClickList[blockKey].time = new Date().getTime();
    }

    if (keysLength(checkBlockClickList) === 2) {
      if (!shouldPaintLine(checkBlockClickList, lineData)) {
        checkBlockClickList = {};
        return;
      }

      const { result, fromKey, toKey } = generateLineData(lineData, lineKey);

      if (onChange) {
        onChange(data, result);
      }

      checkBlockClickList = {};
      // record mapping for arrow
      mapping[lineKey] = {
        fromKey,
        toKey,
      };
    }
  };

  return (
    <>
      {Object.keys(data).map(blockKey => {
        const { x, y, className: blockClassName } = (data as any)[blockKey];
        return (
          <Draggable
            position={{ x, y }}
            onDrag={(_, item) => handleDrag(item, blockKey)}
            onStart={handleDragStart}
            key={blockKey}
          >
            <div
              className={classNames(
                'block-group',
                'animate-appear',
                parentClassName,
                blockClassName,
              )}
              onClick={() => handleBlockClick(blockKey)}
              ref={ref =>
                ref && (blockDOM[blockKey] = ref.getBoundingClientRect())
              }
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
        );
      })}
      {renderLine(addBlockDom(lineData, blockDOM))}
    </>
  );
};

export default BlockGroup;
