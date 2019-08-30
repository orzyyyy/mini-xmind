import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import Draggable from 'react-draggable';
import {
  generateKey,
  stopPropagation,
  preventDefault,
} from '../utils/LineUtil';
import './css/BlockGroup.css';
import { ContextMenuProps } from '../canvas/core';
import { LineProps } from './LineGroup';
import { DataSource } from '../../es/canvas';
import { convertDomRect2Object } from '../utils/commonUtil';

export type BlockProps = { [blockKey: string]: { x: number; y: number } };
export interface BlockGroupProps {
  className?: string;
  data: BlockProps;
  lineData: LineProps;
  onChange?: (data: DataSource, blockDOM: any) => void;
  offset?: { x: number; y: number };
  onContextMenu?: (item: ContextMenuProps) => void;
  renderLine: (blockDOM: any) => void;
  getCleanClickList: (clean: Function) => void;
}
export interface BlockGroupState {
  data?: DataSource;
  lineData?: LineProps;
}

export const updateLineDataByTargetDom = (
  lineData: LineProps,
  targetBlockDOM: any,
) => {
  for (const key of Object.keys(lineData)) {
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
  getCleanClickList,
  ...rest
}: BlockGroupProps) => {
  const [blockDom, setBlockDom]: any = useState({});
  const [lineMapping, setLineMapping]: any = useState({});
  const [clickList, setClickList]: any = useState({});

  const cleanClickList = () => {
    setClickList({});
  };

  useEffect(() => {
    getCleanClickList(cleanClickList);
  }, []);

  const shouldPaintLine = (clickList: any, linesProps: any) => {
    if (!Object.keys(linesProps).length) {
      return true;
    }

    const blocks = Object.keys(clickList).toString();
    for (const key of Object.keys(lineMapping)) {
      let fromFlag = false;
      let toFlag = false;
      const { fromKey, toKey } = lineMapping[key];

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

  const handleBlockClick = (
    blockKey: string,
    data: DataSource,
    lineData: LineProps,
    onChange?: (data: DataSource, lineData?: LineProps) => void,
  ) => {
    const lineKey = generateKey('line');

    clickList[blockKey] = { current: (blockDom as any)[blockKey] };

    // to know which Block is starting point
    if (!('time' in clickList[blockKey])) {
      clickList[blockKey].time = new Date().getTime();
    }

    if (Object.keys(clickList).length === 2) {
      if (!shouldPaintLine(clickList, lineData)) {
        cleanClickList();
        return;
      }

      const { result, fromKey, toKey } = generateLineData(lineData, lineKey);

      if (onChange) {
        onChange(data, result);
      }

      // clean up after draw a line
      cleanClickList();
      // record mapping for arrow
      setLineMapping({ [lineKey]: { fromKey, toKey } });
    }
  };

  const generateLineData = (lineData: any, lineKey: string) => {
    let fromNode;
    let toNode;
    let fromKey;
    let toKey;
    const keys = Object.keys(clickList);

    if (clickList[keys[0]].time > clickList[keys[1]].time) {
      fromKey = keys[1];
      toKey = keys[0];
    } else {
      fromKey = keys[0];
      toKey = keys[1];
    }

    fromNode = clickList[fromKey].current;
    toNode = clickList[toKey].current;

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

  const handleDrag = ({ x, y }: { x: number; y: number }, blockKey: string) => {
    if (onChange) {
      onChange(Object.assign({}, data, { [blockKey]: { x, y } }), blockDom);
    }
  };

  const saveRef = (targetDom: HTMLDivElement | null, blockKey: string) => {
    if (targetDom) {
      const convert = convertDomRect2Object(targetDom.getBoundingClientRect());
      const target = {
        [blockKey]: convert,
      };
      const item = blockDom[blockKey];
      const result = Object.assign({}, blockDom, target);
      if (!item) {
        setBlockDom(result);
      }
      if (item && JSON.stringify(convert) !== JSON.stringify(item)) {
        setBlockDom(result);
      }
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
              onClick={() =>
                handleBlockClick(blockKey, data, lineData, onChange)
              }
              ref={ref => saveRef(ref, blockKey)}
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
      {renderLine(blockDom)}
    </>
  );
};

export default BlockGroup;
