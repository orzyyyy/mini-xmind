import React from 'react';
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
  cleanCheckBlockClickList,
} from '../tools/BlockGroup';
import Draggable from 'react-draggable';
import { TagProps } from 'antd/lib/tag';

export type CanvasPositionProps = {
  x: number;
  y: number;
  z: number;
  gap: number;
};
export type DataSource = {
  CanvasPosition?: CanvasPositionProps;
  BlockGroup?: BlockProps;
  TagGroup?: TagGroupItem;
  LineGroup?: LineProps;
};
export interface CanvasProps {
  className?: string;
  data: DataSource;
  orientation?: 'h' | 'v' | 'horizonal' | 'vertical';
  blockClassName?: string;
  tagClassName?: string;
  lineClassName?: string;
  onChange?: (item: DataSource) => void;
  onWheel?: (item: DataSource, event?: any) => void;
  onClick?: () => void;
}
export interface CanvasState {
  newBlockProps?: BlockProps;
  newLinesProps?: LineProps;
  newTagProps?: TagProps;
  newPosition?: CanvasPositionProps;
}
export type ContextMenuProps = {
  event: Event;
  key: string;
  group: string;
};

const defaultCanvasPosition = { x: 0, y: 0, z: 0, gap: 1 };
let dataCollector: any;

const Canvas = ({
  className,
  orientation,
  blockClassName,
  tagClassName,
  lineClassName,
  data,
  onChange,
  onWheel,
  ...rest
}: CanvasProps) => {
  let blockProps = data.BlockGroup || {};
  let linesProps = data.LineGroup || {};
  let tagProps = data.TagGroup || {};
  let position = data.CanvasPosition || defaultCanvasPosition;

  const handleBlockChange = (
    newBlockProps: BlockProps,
    newLinesProps: LineProps,
  ) => {
    if (onChange) {
      onChange(getTarData({ newBlockProps, newLinesProps }));
    }
  };

  const handleTagChange = (newTagProps: any) => {
    if (onChange) {
      onChange(getTarData({ newTagProps }));
    }
  };

  const onDrop = (e: any) => {
    let dragItem = e.dataTransfer.getData('dragItem');
    if (!dragItem) {
      return false;
    }
    dragItem = dragItem ? JSON.parse(dragItem) : {};
    const { value } = dragItem;
    const { clientX, clientY } = e;
    let defaultWidth = 100;
    let defaultHeight = 80;
    const newBlockProps: any = {};
    const newTagProps: any = {};

    switch (value) {
      case 'block':
        newBlockProps[generateKey('block')] = {
          x: clientX - defaultWidth / 2 - position.x,
          y: clientY - defaultHeight / 2 - position.y,
        };
        if (onChange) {
          onChange(getTarData({ newBlockProps }));
        }
        break;

      case 'input':
        defaultWidth = 100;
        defaultHeight = 32;
        newTagProps[generateKey('tag')] = {
          x: clientX - defaultWidth / 2 - position.x,
          y: clientY - defaultHeight / 2 - position.y,
          editable: true,
        };
        if (onChange) {
          onChange(getTarData({ newTagProps }));
        }
        break;
      default:
        break;
    }
  };

  const handleDrag = (_: any, { x, y }: { x: number; y: number }) => {
    const newPosition = Object.assign({}, position, { x, y });
    if (onChange) {
      onChange(getTarData({ newPosition }));
    }
  };

  const handleDragStart = (e: any) => {
    cleanCheckBlockClickList();
    stopPropagation(e);
  };

  const handleRightClick = ({ key, event, group }: ContextMenuProps) => {
    preventDefault(event);
    delete dataCollector[group][key];
    if (!dataCollector.LineGroup) {
      return;
    }
    for (const lineKey of Object.keys(dataCollector.LineGroup)) {
      const { fromKey, toKey } = dataCollector.LineGroup[lineKey];
      if (group === 'BlockGroup' && (fromKey === key || toKey === key)) {
        delete dataCollector.LineGroup[lineKey];
      }
    }
    if (onChange) {
      onChange(getTarData({}));
    }
  };

  const handleOnWhell = (e: any) => {
    if (onWheel) {
      onWheel(getTarData({}), e);
    }
  };

  const getTarData = ({
    newBlockProps,
    newLinesProps,
    newTagProps,
    newPosition,
  }: CanvasState) => {
    return {
      BlockGroup: Object.assign({}, blockProps, newBlockProps),
      LineGroup: Object.assign({}, linesProps, newLinesProps),
      TagGroup: Object.assign({}, tagProps, newTagProps),
      CanvasPosition: Object.assign({}, position, newPosition),
    };
  };

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
        onWheel={handleOnWhell}
        {...rest}
      >
        <BlockGroup
          offset={position}
          data={blockProps}
          onChange={handleBlockChange}
          lineData={linesProps}
          className={blockClassName}
          onContextMenu={handleRightClick}
          renderLine={lineData => (
            <LineGroup
              data={lineData}
              offset={position}
              orientation={orientation}
              className={lineClassName}
            />
          )}
        />
        <TagGroup
          data={tagProps}
          onChange={handleTagChange}
          className={tagClassName}
          onContextMenu={handleRightClick}
        />
      </div>
    </Draggable>
  );
};

export default Canvas;
