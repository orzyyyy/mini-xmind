import React, { Component } from 'react';
import classNames from 'classnames';
import Draggable from 'react-draggable';
import { Input } from 'antd';
import { isSameCoordinate } from '../utils/commonUtil';
import './assets/TagGroup.css';
import { stopPropagation } from '../utils/LineUtil';

// to save the key of currently dragging Tag
let currentTag = '';

export interface TagGroupProps {
  data?: any;
  onChange?: (data: any) => void;
  className?: string;
}
export interface TagGroupState {
  data?: any;
}

export default class TagGroup extends Component<TagGroupProps, TagGroupState> {
  static getDerivedStateFromProps(
    nextProps: TagGroupProps,
    nextState: TagGroupState,
  ) {
    if (isSameCoordinate(nextProps, nextState, currentTag)) {
      return null;
    }
    return { data: nextProps.data };
  }

  constructor(props: TagGroupProps) {
    super(props);

    this.state = {
      data: {},
    };
  }

  handleStop = ({ x, y }: { x: number; y: number }, key: string) => {
    const { data, onChange } = this.props;

    data[key] = Object.assign({}, data[key], { x, y });

    onChange && onChange(data);
  };

  handleChange = (
    item: any,
    key: string,
    targetKey: string,
    targetValue: boolean | string,
  ) => {
    const { data } = this.state;
    data[key] = item;
    data[key][targetKey] = targetValue;

    this.setState({ data });
  };

  handleDragStart = (e: any) => {
    stopPropagation(e);
  };

  handleDrag = (key: string) => {
    const { onChange } = this.props;
    currentTag = key;
    onChange && onChange(this.props.data);
  };

  render = () => {
    const { className, onChange, ...rest } = this.props;
    const { data } = this.state;

    (window as any).DataCollector.set('TagGroup', data);
    return Object.keys(data).map(key => {
      const { x, y, style, editable } = data[key];

      if (editable) {
        return (
          <div
            className={classNames('TagGroup', className)}
            style={Object.assign({}, style, {
              transform: `translate(${x}px, ${y}px)`,
            })}
            key={key}
            {...rest}
          >
            <Input
              className="animate-appear"
              onChange={e =>
                this.handleChange(data[key], key, 'input', e.target.value)
              }
              value={data[key].input}
              autoFocus
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
          onStop={(e, item) => this.handleStop(item, key)}
          key={key}
          position={{ x, y }}
          onDrag={e => this.handleDrag(key)}
        >
          <div
            className={classNames('TagGroup', className, 'animate-appear')}
            style={style}
            onDoubleClick={() =>
              this.handleChange(data[key], key, 'editable', true)
            }
            {...rest}
          >
            {data[key].input}
          </div>
        </Draggable>
      );
    });
  };
}
