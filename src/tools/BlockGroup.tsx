import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import Draggable from 'react-draggable';
import {
  generateKey,
  stopPropagation,
  preventDefault,
} from '../utils/LineUtil';
import './css/BlockGroup.css';
import { ContextMenuProps, DataSource } from '../canvas/core';
import { LineProps } from './LineGroup';
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
  getCleanClickList?: (clean: Function) => void;
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

export const generateLineData = (
  lineData: any,
  lineKey: string,
  clickList: any,
) => {
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

export const shouldPaintLine = (
  clickList: any,
  lineData: any,
  lineMapping: any,
) => {
  if (!Object.keys(lineData).length) {
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
}: BlockGroupProps) => {
  const [blockDom, setBlockDom]: any = useState({});
  const [lineMapping, setLineMapping]: any = useState({});
  const [clickList, setClickList]: any = useState({});

  const cleanClickList = () => {
    setClickList({});
  };

  useEffect(() => {
    if (getCleanClickList) {
      getCleanClickList(cleanClickList);
    }
  }, []);

  const handleBlockClick = (blockKey: string) => {
    const lineKey = generateKey('line');
    clickList[blockKey] = { current: (blockDom as any)[blockKey] };

    // to record which Block is the starting point
    if (!('time' in clickList[blockKey])) {
      clickList[blockKey].time = new Date().getTime();
      setClickList(clickList);
    }

    if (Object.keys(clickList).length === 2) {
      if (!shouldPaintLine(clickList, lineData, lineMapping)) {
        cleanClickList();
        return;
      }

      const { result, fromKey, toKey } = generateLineData(
        lineData,
        lineKey,
        clickList,
      );

      // clean up after drawing a line
      cleanClickList();
      // record mapping for arrow
      setLineMapping(
        Object.assign({}, lineMapping, { [lineKey]: { fromKey, toKey } }),
      );

      if (onChange) {
        onChange(data, result);
      }
    }
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
              onClick={() => handleBlockClick(blockKey)}
              ref={ref => saveRef(ref, blockKey)}
              onContextMenu={(e: any) => {
                if (onContextMenu) {
                  onContextMenu({
                    event: e,
                    key: blockKey,
                    group: 'block-group',
                  });
                }
              }}
            />
          </Draggable>
        );
      })}
      {renderLine(blockDom)}
    </>
  );
};

export default BlockGroup;
