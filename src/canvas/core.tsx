import React, { useState, useEffect } from 'react';
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
  blockProps?: BlockProps;
  linesProps?: LineProps;
  tagProps?: TagProps;
  position: CanvasPositionProps;
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
  const [blockProps, setBlockProps] = useState(data.BlockGroup || {});
  const [linesProps, setLineProps] = useState(data.LineGroup || {});
  const [tagProps, setTagProps] = useState(data.TagGroup || {});
  const [position, setPosition] = useState(
    data.CanvasPosition || defaultCanvasPosition,
  );

  useEffect(() => {
    if (data) {
      const { BlockGroup, LineGroup, TagGroup, CanvasPosition } = data;
      setBlockProps(BlockGroup || {});
      setLineProps(LineGroup || {});
      setTagProps(TagGroup || {});
      setPosition(CanvasPosition || defaultCanvasPosition);
      dataCollector = data;
    }
  }, [data]);

  const handleBlockChange = (blockProps: BlockProps, linesProps: LineProps) => {
    handleUnityAllDatas(blockProps, 'BlockGroup');
    handleUnityAllDatas(linesProps, 'LineGroup');
    setBlockProps(blockProps);
    setLineProps(linesProps);
  };

  const handleTagChange = (tagProps: any) => {
    handleUnityAllDatas(tagProps, 'TagGroup');
    setTagProps(tagProps);
  };

  const handleUnityAllDatas = (
    data?: BlockProps | TagGroupItem | LineProps | CanvasPositionProps,
    type?: string,
  ) => {
    if (data && type) {
      dataCollector[type] = data;
    }
    if (onChange) {
      onChange(dataCollector);
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

    switch (value) {
      case 'block':
        if (blockProps) {
          (blockProps as any)[generateKey('block')] = {
            x: clientX - defaultWidth / 2 - position.x,
            y: clientY - defaultHeight / 2 - position.y,
          };
          handleUnityAllDatas(blockProps, 'BlockGroup');
          setBlockProps(blockProps);
        }
        break;

      case 'input':
        defaultWidth = 100;
        defaultHeight = 32;
        (tagProps as any)[generateKey('tag')] = {
          x: clientX - defaultWidth / 2 - position.x,
          y: clientY - defaultHeight / 2 - position.y,
          editable: true,
        };
        handleUnityAllDatas(tagProps, 'TagGroup');
        setTagProps(tagProps);
        break;
      default:
        break;
    }
    return {
      x: clientX - defaultWidth / 2 - position.x,
      y: clientY - defaultHeight / 2 - position.y,
    };
  };

  const handleDrag = (_: any, { x, y }: { x: number; y: number }) => {
    const newPosition = Object.assign({}, position, { x, y });
    handleUnityAllDatas(newPosition, 'CanvasPosition');
    setPosition(newPosition);
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
    handleUnityAllDatas();
  };

  const handleOnWhell = (e: any) => {
    if (onWheel) {
      onWheel(dataCollector, e);
    }
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
