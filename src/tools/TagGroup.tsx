import React from 'react';
import classNames from 'classnames';
import Draggable, { DraggableEvent, DraggableData } from 'react-draggable';
import { Input } from 'antd';
import './css/TagGroup.css';
import { stopPropagation, preventDefault } from '../utils/LineUtil';
import { ContextMenuProps, CoordinatesProps, CommonProps } from '../canvas/core';
import NinoZone, { getTargetDom } from '../canvas/nino-zone';
import { LineProps } from './LineGroup';

export type TagDomItem = CommonProps & CoordinatesProps & { input: string };
export type TagGroupRenderItem = {
  item: CommonProps & CoordinatesProps & { input: string };
  key: string;
  className: string;
  onContextMenu?: ({ event, key, group }: ContextMenuProps) => void;
};
export type TagGroupItem = {
  [key: string]: CoordinatesProps & {
    input: string;
    editable: boolean;
    className?: string;
    children?: string[];
  };
};
export interface TagGroupProps {
  data: TagGroupItem;
  onChange: (data: TagGroupItem, tagDom: TagDomItem, targetKey?: string) => void;
  className?: string;
  onContextMenu: (item: ContextMenuProps) => void;
  lineData: LineProps;
  onWheel: (data: TagGroupItem, key: string, event: React.WheelEvent) => void;
}
export interface TagGroupState {
  data: TagGroupItem;
}

const handleDragStart = (e: DraggableEvent) => {
  stopPropagation(e);
  preventDefault(e);
};

const TagGroup = ({ data, onChange, onContextMenu, className: parentClassName, lineData, onWheel }: TagGroupProps) => {
  const handleChange = (item: any, key: string, targetKey: string, targetValue: boolean | string) => {
    data[key] = item;
    (data as any)[key][targetKey] = targetValue;

    if (onChange) {
      onChange(Object.assign({}, data, { [key]: item }), getTargetDom());
    }
  };

  const handleDrag = ({ x, y }: DraggableData, key: string) => {
    if (onChange) {
      onChange(Object.assign({}, data, { [key]: { ...data[key], x, y } }), getTargetDom());
    }
  };

  const renderTextArea = ({ item, key, className }: TagGroupRenderItem) => (
    <div
      className={className}
      style={{
        transform: `translate(${item.x}px, ${item.y}px)`,
      }}
      key={key}
    >
      <Input.TextArea
        className="animate-appear"
        onChange={e => handleChange(item, key, 'input', e.target.value)}
        value={item.input}
        autoFocus
        autoSize
        onBlur={() => handleChange(item, key, 'editable', false)}
      />
    </div>
  );

  const renderTagItem = ({ item, key, onContextMenu, className }: TagGroupRenderItem) => (
    <Draggable
      onStart={handleDragStart}
      key={key}
      position={{ x: item.x, y: item.y }}
      onDrag={(_: DraggableEvent, jtem: DraggableData) => handleDrag(jtem, key)}
    >
      <div
        onDoubleClick={() => handleChange(item, key, 'editable', true)}
        style={{ width: 199, wordBreak: 'break-all' }}
      >
        <NinoZone
          className={className}
          onContextMenu={onContextMenu}
          name="tag-group"
          onChange={onChange}
          key={`nino-zone-${key}`}
          targetKey={key}
          data={data}
          lineData={lineData}
          onWheel={onWheel}
        >
          {/* this should not be wrapper with a block element such as a div,
            or lines will get crashed */}
          {item.children && <span style={item.childStyle}>+</span>}
          {item.input}
        </NinoZone>
      </div>
    </Draggable>
  );

  return (
    <>
      {Object.keys(data).map(key => {
        const item = data[key];
        const { editable, className: tagClassName } = item;
        const targetClassName = classNames('tag-group', 'animate-appear', parentClassName, tagClassName);
        if (editable) {
          return renderTextArea({
            item,
            key,
            className: targetClassName,
          });
        }
        return renderTagItem({
          item,
          key,
          className: targetClassName,
          onContextMenu,
        });
      })}
    </>
  );
};

export default TagGroup;
