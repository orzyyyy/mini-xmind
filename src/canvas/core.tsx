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
  const target = Object.assign({}, data);
  if (!current) {
    const tag: TagGroupItem = {};
    const block: BlockProps = {};
    const parents: string[] = [];

    for (const key in data.tag) {
      const { parent = 'root' } = (data as any).tag[key];
      if (parent === 'root') {
        tag[key] = (data as any).tag[key];
      } else {
        parents.push(key);
      }
    }
    target.tag = tag;

    for (const key in data.block) {
      const { parent = 'root' } = (data as any).block[key];
      if (parent === 'root') {
        block[key] = (data as any).block[key];
      } else {
        parents.push(key);
      }
    }
    target.block = block;

    for (const item of parents) {
      for (const key in data.line) {
        const lineItem = data.line[key];
        if (item === lineItem.toKey || item === lineItem.fromKey) {
          delete (target as any).line[key];
        }
      }
    }

    return target;
  }

  const splitArr = current.split('-');
  const prefix = splitArr.length && splitArr[0];
  const item = (target as any)[prefix];

  // Handle element
  const result: any = {};
  for (const key in item) {
    const parent = item[key].parent || 'root';

    if (parent === current) {
      result[parent] = item[parent];
      result[key] = item[key];
    }
  }
  (target as any)[prefix] = result;

  // Handle line
  // for (const key in data['line']) {
  // }

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

  useEffect(() => {
    setLineMapping(line);
  }, [line]);

  const handleBlockChange = (newBlock: BlockProps, blockDOM: any) => {
    if (onChange) {
      const newLine = updateLineDataByTargetDom(line, blockDOM);
      onChange(getMergedData({ block: newBlock, line: newLine }));
    }
  };

  const handleTagChange = (newTag: TagGroupItem) => {
    if (onChange) {
      onChange(getMergedData({ tag: newTag }));
    }
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

    if (onChange) {
      onChange(getMergedData({ [type]: result }));
    }
  };

  const handleDrag = (_: any, newPosition: CoordinatesProps) => {
    if (onChange) {
      onChange(getMergedData({ position: newPosition }));
    }
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
    if (onChange) {
      onChange(getMergedData({ block, line, tag }));
    }
  };

  const onElementWheel = (data: any) => {
    if (data.parent && !zoomHistory.includes(data.parent)) {
      zoomHistory.push(current);
      setZoomHistory(Array.from(new Set(zoomHistory)));

      if (onChange) {
        onChange(getMergedData({ current: data.parent }));
      }
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

  const getMergedData = ({
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
  }): DataSource => {
    newCurrent = newCurrent || current;
    return {
      block: Object.assign({}, block, newBlock),
      line: Object.assign({}, line, newLine),
      tag: Object.assign({}, tag, newTag),
      position: { [newCurrent]: Object.assign({}, position, newPosition) },
      current: newCurrent,
    };
  };

  const renderLineGroup = (targetDom: any) => (
    <LineGroup
      data={updateLineDataByTargetDom(line, targetDom)}
      offset={position}
      orientation={orientation}
      arrowStatus={arrowStatus}
    />
  );

  return (
    <Draggable
      onDrag={handleDrag}
      position={position}
      onStart={handleDragStart}
    >
      <div
        className={classNames('Canvas', className)}
        onDragOver={preventDefault}
        onDrop={onDrop}
        onWheel={handleCanvasWheel}
      >
        {
          <>
            <BlockGroup
              offset={position}
              data={block}
              onChange={handleBlockChange}
              lineData={line}
              onContextMenu={handleRightClick}
              onWheel={onElementWheel}
            />
            <TagGroup
              data={tag}
              onChange={handleTagChange}
              lineData={line}
              onContextMenu={handleRightClick}
              onWheel={onElementWheel}
            />
          </>
        }
        {renderLineGroup(getTargetDom())}
      </div>
    </Draggable>
  );
};

export default Canvas;
