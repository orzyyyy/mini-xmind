import React from 'react';
import classNames from 'classnames';
import Draggable from 'react-draggable';
import { Input } from 'antd';
import './css/TagGroup.css';
import { stopPropagation } from '../utils/LineUtil';
import { ContextMenuProps } from '../canvas/core';

export type TagGroupRenderItem = {
  item: { input: string; x: number; y: number };
  key: string;
  className: string;
  onContextMenu?: ({ event, key, group }: ContextMenuProps) => void;
};
export type TagGroupItem = {
  [key: string]: {
    x: number;
    y: number;
    input: string;
    editable: boolean;
    className?: string;
  };
};
export interface TagGroupProps {
  data: TagGroupItem;
  onChange?: (data: TagGroupItem) => void;
  className?: string;
  onContextMenu?: (item: ContextMenuProps) => void;
}
export interface TagGroupState {
  data: TagGroupItem;
}

const TagGroup = ({
  data,
  onChange,
  onContextMenu,
  className: parentClassName,
}: TagGroupProps) => {
  const handleStop = ({ x, y }: { x: number; y: number }, key: string) => {
    data[key] = Object.assign({}, data[key], { x, y });
    if (onChange) {
      onChange(data);
    }
  };

  const handleChange = (
    item: any,
    key: string,
    targetKey: string,
    targetValue: boolean | string,
  ) => {
    data[key] = item;
    (data as any)[key][targetKey] = targetValue;

    if (onChange) {
      onChange(data);
    }
  };

  const handleDragStart = (e: any) => {
    stopPropagation(e);
  };

  const handleDrag = () => {
    if (onChange) {
      onChange(data);
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
        autosize
        onBlur={() => handleChange(item, key, 'editable', false)}
      />
    </div>
  );

  const renderTagItem = ({
    item,
    key,
    onContextMenu,
    className,
  }: TagGroupRenderItem) => (
    <Draggable
      onStart={handleDragStart}
      onStop={(_, jtem) => handleStop(jtem, key)}
      key={key}
      position={{ x: item.x, y: item.y }}
      onDrag={handleDrag}
    >
      <div
        className={className}
        onDoubleClick={() => handleChange(item, key, 'editable', true)}
        onContextMenu={(e: any) => {
          if (onContextMenu) {
            onContextMenu({ event: e, key, group: 'TagGroup' });
          }
        }}
      >
        {item.input}
      </div>
    </Draggable>
  );

  return (
    <>
      {Object.keys(data).map(key => {
        const item = (data as any)[key];
        const { editable, className: tagClassName } = item;
        const targetClassName = classNames(
          'tag-group',
          'animate-appear',
          parentClassName,
          tagClassName,
        );
        if (editable) {
          return renderTextArea({ item, key, className: targetClassName });
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
