import React from 'react';
import classNames from 'classnames';
import Draggable from 'react-draggable';
import { Input } from 'antd';
import './css/TagGroup.css';
import { stopPropagation, preventDefault } from '../utils/LineUtil';
import { ContextMenuProps, CoordinatesProps } from '../canvas/core';
import NinoZone from '../canvas/nino-zone';
import { LineProps } from './LineGroup';

export type TagGroupRenderItem = {
  item: CoordinatesProps & { input: string };
  key: string;
  className: string;
  onContextMenu?: ({ event, key, group }: ContextMenuProps) => void;
};
export type TagGroupItem = {
  [key: string]: CoordinatesProps & {
    input: string;
    editable: boolean;
    className?: string;
  };
};
export interface TagGroupProps {
  data: TagGroupItem;
  onChange: (data: TagGroupItem) => void;
  className?: string;
  onContextMenu: (item: ContextMenuProps) => void;
  lineData: LineProps;
}
export interface TagGroupState {
  data: TagGroupItem;
}

const handleDragStart = (e: any) => {
  stopPropagation(e);
  preventDefault(e);
};

const TagGroup = ({
  data,
  onChange,
  onContextMenu,
  className: parentClassName,
  lineData,
}: TagGroupProps) => {
  const handleChange = (
    item: any,
    key: string,
    targetKey: string,
    targetValue: boolean | string,
  ) => {
    data[key] = item;
    (data as any)[key][targetKey] = targetValue;

    if (onChange) {
      onChange(Object.assign({}, data, { [key]: item }));
    }
  };

  const handleDrag = ({ x, y }: any, key: string) => {
    if (onChange) {
      onChange(Object.assign({}, data, { [key]: { ...data[key], x, y } }));
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
      key={key}
      position={{ x: item.x, y: item.y }}
      onDrag={(_: any, jtem: any) => handleDrag(jtem, key)}
    >
      <div onDoubleClick={() => handleChange(item, key, 'editable', true)}>
        <NinoZone
          className={className}
          onContextMenu={onContextMenu}
          name="tag-group"
          onChange={onChange}
          key={`nino-zone-${key}`}
          targetKey={key}
          data={data}
          lineData={lineData}
        >
          {item.input}
        </NinoZone>
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
