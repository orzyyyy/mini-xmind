import React, { Component } from 'react';
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
  data?: TagGroupItem;
  onChange?: (data: TagGroupItem) => void;
  className?: string;
  onContextMenu?: (item: ContextMenuProps) => void;
}
export interface TagGroupState {
  data: TagGroupItem;
}

export default class TagGroup extends Component<TagGroupProps, TagGroupState> {
  static getDerivedStateFromProps(
    nextProps: TagGroupProps,
    nextState: TagGroupState,
  ) {
    if (
      Object.keys(nextProps.data || {}).length !==
        Object.keys(nextState.data || {}).length &&
      nextProps.onChange &&
      nextProps.data
    ) {
      nextProps.onChange(nextProps.data);
    }
    if (!nextProps.data) {
      return { data: {} };
    }
    return { data: nextProps.data };
  }

  state: TagGroupState = {
    data: {},
  };

  handleStop = ({ x, y }: { x: number; y: number }, key: string) => {
    const { data, onChange } = this.props;
    if (data) {
      data[key] = Object.assign({}, data[key], { x, y });
      if (onChange) {
        onChange(data);
      }
    }
  };

  handleChange = (
    item: any,
    key: string,
    targetKey: string,
    targetValue: boolean | string,
  ) => {
    const { onChange } = this.props;
    const { data } = this.state;
    data[key] = item;
    (data as any)[key][targetKey] = targetValue;

    if (onChange) {
      onChange(data);
    }
    this.setState({ data });
  };

  handleDragStart = (e: any) => {
    stopPropagation(e);
  };

  handleDrag = () => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(this.state.data);
    }
  };

  renderTextArea = ({ item, key, className }: TagGroupRenderItem) => (
    <div
      className={className}
      style={{
        transform: `translate(${item.x}px, ${item.y}px)`,
      }}
      key={key}
    >
      <Input.TextArea
        className="animate-appear"
        onChange={e => this.handleChange(item, key, 'input', e.target.value)}
        value={item.input}
        autoFocus
        autosize
        onBlur={() => this.handleChange(item, key, 'editable', false)}
      />
    </div>
  );

  renderTagItem = ({
    item,
    key,
    onContextMenu,
    className,
  }: TagGroupRenderItem) => (
    <Draggable
      onStart={this.handleDragStart}
      onStop={(_, jtem) => this.handleStop(jtem, key)}
      key={key}
      position={{ x: item.x, y: item.y }}
      onDrag={this.handleDrag}
    >
      <div
        className={className}
        onDoubleClick={() => this.handleChange(item, key, 'editable', true)}
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

  render = () => {
    const { className: parentClassName, onContextMenu } = this.props;
    const { data } = this.state;

    return Object.keys(data).map(key => {
      const item = data[key];
      const { editable, className: tagClassName } = item;
      const targetClassName = classNames(
        'tag-group',
        'animate-appear',
        parentClassName,
        tagClassName,
      );
      if (editable) {
        return this.renderTextArea({ item, key, className: targetClassName });
      }
      return this.renderTagItem({
        item,
        key,
        className: targetClassName,
        onContextMenu,
      });
    });
  };
}
