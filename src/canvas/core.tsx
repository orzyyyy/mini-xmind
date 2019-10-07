import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import LineGroup, { LineProps } from '../tools/LineGroup';
import {
  preventDefault,
  generateKey,
  stopPropagation,
} from '../utils/LineUtil';
import TagGroup, { TagGroupItem } from '../tools/TagGroup';
import BlockGroup, {
  BlockProps,
  updateLineDataByTargetDom,
} from '../tools/BlockGroup';
import Draggable from 'react-draggable';
import { setClickList, getTargetDom, setLineMapping } from './nino-zone';
import { OrientationProps } from '../line/SteppedLine';

export interface CoordinatesProps {
  x: number;
  y: number;
}
export type DataSource = {
  position?: {
    [key: string]: CoordinatesProps;
  };
  block?: BlockProps;
  tag?: TagGroupItem;
  line?: LineProps;
  current?: string;
};
export interface CanvasProps {
  className?: string;
  data: DataSource;
  orientation?: OrientationProps;
  onChange: (item: DataSource) => void;
  arrowStatus?: [boolean, boolean, boolean];
}
export type ContextMenuProps = {
  event: Event;
  key: string;
  group: 'block-group' | 'tag-group';
};

const filterCurrentElement = (data: DataSource) => {
  const { current } = data;
  const target = JSON.parse(JSON.stringify(data));
  if (!current || current === 'root') {
    const childrenList: string[] = [];

    for (const key in target) {
      const value = (target as any)[key];
      for (const innerKey in value) {
        const innerValue = value[innerKey];
        if (innerValue.children) {
          childrenList.push(...innerValue.children);
        }
      }
    }

    // Handle with Line
    for (const key in target.line) {
      const value = target.line[key];
      for (const item of childrenList) {
        if (value.fromKey === item || value.toKey === item) {
          delete target.line[key];
        }
      }
    }

    // Handle with Groups
    for (const key in target) {
      const value = (target as any)[key];
      for (const innerKey in value) {
        for (const item of childrenList) {
          if (innerKey === item) {
            delete value[innerKey];
          }
        }
      }
    }

    return target;
  }

  const splitArr = current.split('-');
  const prefix = splitArr.length && splitArr[0];
  const targetSet = (target as any)[prefix];
  const { children } = targetSet[current];
  const instance: TagGroupItem = {};

  // Handle element
  instance[current] = targetSet[current];
  for (const item of children) {
    instance[item] = targetSet[item];
  }
  target[prefix] = instance;

  // Handle with Line
  for (const key in target.line) {
    const value = target.line[key];
    if (!children.includes(value.fromKey) && !children.includes(value.toKey)) {
      delete target.line[key];
    }
  }

  return target;
};

const Canvas = ({
  className,
  orientation = 'horizonal',
  data: originData,
  onChange,
  arrowStatus,
}: CanvasProps) => {
  const data = filterCurrentElement(originData);
  const { block = {}, line = {}, tag = {}, current = 'root' } = data;
  const position = (data.position && data.position[current]) || {
    x: -1,
    y: -1,
  };
  const [zoomHistory, setZoomHistory] = useState([] as string[]);
  const [tagEditable, setTagEditable] = useState(false);
  const updatedLine = updateLineDataByTargetDom(line, getTargetDom());

  useEffect(() => {
    setLineMapping(line);
  }, [line]);

  const handleBlockChange = (newBlock: BlockProps, blockDom: any) => {
    const newLine = updateLineDataByTargetDom(line, blockDom);
    onChange(getMergedData({ block: newBlock, line: newLine }));
  };

  const handleTagChange = (
    newTag: TagGroupItem,
    tagDom: any,
    targetKey?: string,
  ) => {
    const newLine = updateLineDataByTargetDom(line, tagDom);
    // When `editable` is true, remove <Draggable /> of Canvas,
    // for the resize of textarea
    setTagEditable(!!targetKey);
    onChange(getMergedData({ tag: newTag, line: newLine }));
  };

  const onDrop = (e: any) => {
    let dragItem = e.dataTransfer.getData('dragItem');
    if (!dragItem) {
      return false;
    }
    dragItem = dragItem ? JSON.parse(dragItem) : {};
    const { type }: { type: 'block' | 'tag' } = dragItem;
    const { clientX, clientY } = e;
    const result: any = {};
    const x = clientX - position.x;
    const y = clientY - position.y;
    const key = generateKey(type);

    result[key] = { x, y };

    if (type === 'tag') {
      result[key]['editable'] = true;
    }

    onChange(getMergedData({ [type]: result }));
  };

  const handleDrag = (_: any, { x, y }: CoordinatesProps) => {
    onChange(getMergedData({ position: { x, y } }));
  };

  const handleDragStart = (e: MouseEvent) => {
    setClickList({}, true);
    stopPropagation(e);
  };

  const handleRightClick = ({ key, event, group }: ContextMenuProps) => {
    preventDefault(event);
    switch (group) {
      case 'block-group':
        delete block[key];
        break;

      case 'tag-group':
        delete tag[key];
        break;

      default:
        break;
    }
    for (const lineKey of Object.keys(line)) {
      const { fromKey, toKey } = line[lineKey];
      if (fromKey === key || toKey === key) {
        delete line[lineKey];
      }
    }
    onChange(getMergedData({ block, line, tag }, true));
  };

  const handleElementWheel = (data: any, key: string) => {
    if (data.children && !zoomHistory.includes(key)) {
      zoomHistory.push(current);
      setZoomHistory(Array.from(new Set(zoomHistory)));

      onChange(getMergedData({ current: key }));
    }
  };

  const handleCanvasWheel = (e: any) => {
    if (e.deltaY > 0 && onChange && zoomHistory.length) {
      const temp = zoomHistory.pop();
      const newCurrent = temp === current ? zoomHistory.pop() : temp;
      setZoomHistory(zoomHistory);
      onChange(getMergedData({ current: newCurrent }));
    }
  };

  const getMergedData = (
    {
      block: newBlock,
      line: newLine,
      tag: newTag,
      position: newPosition,
      current: newCurrent,
    }: {
      block?: BlockProps;
      tag?: TagGroupItem;
      line?: LineProps;
      position?: CoordinatesProps;
      current?: string;
    },
    shouldUpdateOriginData?: boolean,
  ): DataSource => {
    newCurrent = newCurrent || current;
    const originPosition = (originData.position as any)[current];

    if (shouldUpdateOriginData) {
      return {
        block: newBlock || originData.block,
        line: newLine || originData.line,
        tag: newTag || originData.tag,
        position: {
          [newCurrent as string]: Object.assign(
            {},
            originPosition,
            newPosition,
          ),
        },
        current: newCurrent,
      };
    }

    return {
      block: Object.assign({}, originData.block, newBlock),
      line: Object.assign({}, originData.line, newLine),
      tag: Object.assign({}, originData.tag, newTag),
      position: {
        [newCurrent as string]: Object.assign({}, originPosition, newPosition),
      },
      current: newCurrent,
    };
  };

  const addWrapper = (children: React.ReactElement) => {
    if (tagEditable) {
      return (
        <div
          className="tag-editting"
          style={{
            transform: `translate3d(${position.x}px,${position.y}px, 0)`,
          }}
        >
          {children}
        </div>
      );
    }

    return (
      <Draggable
        onDrag={handleDrag}
        position={position}
        onStart={handleDragStart}
      >
        {children}
      </Draggable>
    );
  };

  const content = (
    <div
      className={classNames('Canvas', className)}
      onDragOver={preventDefault}
      onDrop={onDrop}
      onWheel={handleCanvasWheel}
    >
      <BlockGroup
        offset={position}
        data={block}
        onChange={handleBlockChange}
        lineData={line}
        onContextMenu={handleRightClick}
        onWheel={handleElementWheel}
      />
      <TagGroup
        data={tag}
        onChange={handleTagChange}
        lineData={line}
        onContextMenu={handleRightClick}
        onWheel={handleElementWheel}
      />
      <LineGroup
        data={updatedLine}
        offset={position}
        orientation={orientation}
        arrowStatus={arrowStatus}
      />
    </div>
  );

  return addWrapper(content);
};

export default Canvas;
