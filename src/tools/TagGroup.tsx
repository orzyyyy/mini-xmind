import React, { Component } from 'react';
import classNames from 'classnames';
import Draggable from 'react-draggable';
import { Input } from 'antd';
import PropTypes from 'prop-types';
import './css/TagGroup.css';
import { stopPropagation } from '../utils/LineUtil';

export interface TagGroupProps {
  data?: any;
  onChange?: (data: any) => void;
  className?: string;
}
export interface TagGroupState {
  data?: any;
}

export default class TagGroup extends Component<TagGroupProps, TagGroupState> {
  static contextTypes = {
    getData: PropTypes.func,
  };

  static getDerivedStateFromProps(nextProps: TagGroupProps) {
    if (!nextProps.data) {
      return { data: {} };
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

  handleDrag = () => {
    const { onChange } = this.props;
    onChange && onChange(this.props.data);
  };

  render = () => {
    const { className: parentClassName, onChange, ...rest } = this.props;
    const { data } = this.state;
    const { getData } = this.context;

    (window as any).DataCollector.set('TagGroup', data);
    getData(data, 'TagGroup');
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
            {...rest}
          >
            {data[key].input}
          </div>
        </Draggable>
      );
    });
  };
}
