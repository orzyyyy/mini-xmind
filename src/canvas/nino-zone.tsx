import React from 'react';
import { convertDomRect2Object } from '../utils/commonUtil';
import { generateKey } from '../utils/LineUtil';
import { ContextMenuProps, DataSource } from './core';
import { BlockProps } from '../tools/BlockGroup';
import { LineProps } from '../tools/LineGroup';

export interface NinoZoneProps {
  targetKey: string;
  onContextMenu?: (item: ContextMenuProps) => void;
  onChange: (data: DataSource, targetDom: any) => void;
  data: BlockProps;
  lineData?: LineProps;
  name: 'block-group' | 'tag-group';
  className?: string;
  children?: any;
  onWheel: (data: any, targetKey: string, event: any) => void;
}

let targetDom: any = {};
export const getTargetDom = () => targetDom;
export const setTargetDom = (target: any, notMerge?: boolean) => {
  targetDom = notMerge ? target : Object.assign({}, targetDom, target);
  return targetDom;
};

let lineMapping: any = {};
export const setLineMapping = (target: any, notMerge?: boolean) => {
  lineMapping = notMerge ? target : Object.assign({}, lineMapping, target);
  return lineMapping;
};

let clickList: any = {};
export const setClickList = (target: any, notMerge?: boolean) => {
  clickList = notMerge ? target : Object.assign({}, clickList, target);
  return clickList;
};

export const generateLineData = (lineData: LineProps, lineKey: string) => {
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

export const shouldPaintLine = (clickList: any, lineData: LineProps) => {
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

const NinoZone = ({
  targetKey,
  onContextMenu,
  onChange,
  data,
  lineData = {},
  name,
  className,
  children,
  onWheel,
}: NinoZoneProps) => {
  const saveRef = (targetRef: HTMLDivElement | null) => {
    if (targetRef) {
      const convert = convertDomRect2Object(targetRef.getBoundingClientRect());
      const target = {
        [targetKey]: convert,
      };
      const targetDom = getTargetDom();
      const item = targetDom[targetKey];
      const result = Object.assign(targetDom, target);
      if (!item) {
        setTargetDom(result);
        return;
      }
    }
  };

  const onClick = () => {
    const lineKey = generateKey('line');
    clickList[targetKey] = { current: (getTargetDom() as any)[targetKey] };

    // to record which Block is the starting point
    if (!('time' in clickList[targetKey])) {
      clickList[targetKey].time = new Date().getTime();
    }
    setClickList(clickList);

    if (Object.keys(clickList).length === 2) {
      if (!shouldPaintLine(clickList, lineData)) {
        setClickList({}, true);
        return;
      }

      const { result, fromKey, toKey } = generateLineData(lineData, lineKey);

      // clean up after drawing a line
      setClickList({}, true);
      // record mapping for arrow
      setLineMapping(Object.assign({}, lineMapping, { [lineKey]: { fromKey, toKey } }));

      if (onChange) {
        onChange(data, result);
      }
    }
  };

  return (
    <div
      onClick={onClick}
      ref={saveRef}
      className={className}
      onWheel={e => {
        if (e.deltaY <= 0) {
          onWheel((data as any)[targetKey], targetKey, e);
        }
      }}
      onContextMenu={(e: any) => {
        onContextMenu &&
          onContextMenu({
            event: e,
            key: targetKey,
            group: name,
          });
      }}
    >
      {children}
    </div>
  );
};

export default NinoZone;
