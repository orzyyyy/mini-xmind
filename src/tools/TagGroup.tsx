import React, { Component } from 'react';
import classNames from 'classnames';
import Draggable from 'react-draggable';
import { Input } from 'antd';
import './css/TagGroup.css';
import { stopPropagation } from '../utils/LineUtil';
import { ContextMenuProps } from '../canvas/core';

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
    data[key] = Object.assign({}, data[key], { x, y });
    if (onChange) {
      onChange(data);
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

  render = () => {
    const {
      className: parentClassName,
      onChange,
      onContextMenu,
      ...rest
    } = this.props;
    const { data } = this.state;

    return Object.keys(data).map(key => {
      const { x, y, editable, className: tagClassName } = data[key];
      const targetClassName = classNames(
        'tag-group',
        'animate-appear',
        parentClassName,
        tagClassName,
      );

      if (editable) {
        return (
          <div
            className={targetClassName}
            style={{
              transform: `translate(${x}px, ${y}px)`,
            }}
            key={key}
            {...rest}
          >
            <Input.TextArea
              className="animate-appear"
              onChange={e =>
                this.handleChange(data[key], key, 'input', e.target.value)
              }
              value={data[key].input}
              autoFocus
              autosize
              onBlur={() =>
                this.handleChange(data[key], key, 'editable', false)
              }
            />
          </div>
        );
      }

      return (
        <Draggable
          onStart={this.handleDragStart}
          onStop={(_, item) => this.handleStop(item, key)}
          key={key}
          position={{ x, y }}
          onDrag={this.handleDrag}
        >
          <div
            className={targetClassName}
            onDoubleClick={() =>
              this.handleChange(data[key], key, 'editable', true)
            }
            onContextMenu={(e: any) => {
              if (onContextMenu) {
                onContextMenu({ event: e, key, group: 'TagGroup' });
              }
            }}
            {...rest}
          >
            {data[key].input}
          </div>
        </Draggable>
      );
    });
  };
}
