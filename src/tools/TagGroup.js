import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Draggable from 'react-draggable';
import { Input } from 'antd';
import { noop } from '../utils/commonUtil';
import './assets/TagGroup.css';
import { stopPropagation } from '../utils/LineUtil';

export default class TagGroup extends Component {
  static propTypes = {
    data: PropTypes.object,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    data: {},
    onChange: noop,
  };

  static getDerivedStateFromProps(nextProps, nextState) {
    return { data: nextProps.data };
  }

  constructor(props) {
    super(props);

    this.state = {
      data: {},
    };
  }

  handleStop = ({ x, y }, key) => {
    const { data, onChange } = this.props;

    data[key] = Object.assign({}, data[key], { x, y });

    onChange(data);
  };

  handleChange = (item, key, targetKey, targetValue) => {
    const { data } = this.state;
    data[key] = item;
    data[key][targetKey] = targetValue;

    this.setState({ data });
  };

  handleDragStart = e => {
    stopPropagation(e);
  };

  render = () => {
    const { className, onChange, ...rest } = this.props;
    const { data } = this.state;

    DataCollector.set('TagGroup', data);
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
          onDrag={e => onChange(data)}
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
