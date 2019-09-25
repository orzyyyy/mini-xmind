import React, { useEffect } from 'react';
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

const Canvas = ({
  className,
  orientation = 'horizonal',
  data,
  onChange,
  arrowStatus,
  ...rest
}: CanvasProps) => {
  const { block = {}, line = {}, tag = {}, current = 'root' } = data;
  const position = (data.position && data.position[current]) || {
    x: -1,
    y: -1,
  };

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

  const getMergedData = ({
    block: newBlock,
    line: newLine,
    tag: newTag,
    position: newPosition,
    current: newCurrent = current,
  }: {
    block?: BlockProps;
    tag?: TagGroupItem;
    line?: LineProps;
    position?: CoordinatesProps;
    current?: string;
  }): DataSource => {
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
        {...rest}
      >
        {
          <>
            <BlockGroup
              offset={position}
              data={block}
              onChange={handleBlockChange}
              lineData={line}
              onContextMenu={handleRightClick}
            />
            <TagGroup
              data={tag}
              onChange={handleTagChange}
              lineData={line}
              onContextMenu={handleRightClick}
            />
          </>
        }
        {renderLineGroup(getTargetDom())}
      </div>
    </Draggable>
  );
};

export default Canvas;
