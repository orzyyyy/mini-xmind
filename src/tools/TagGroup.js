import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Draggable from 'react-draggable';
import { Input } from 'antd';
import { noop } from '../utils/commonUtil';
import './assets/TagGroup.css';

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
      value: 'test',
    };
  }

  componentDidMount = () => {};

  handleStop = ({ x, y }, key) => {
    const { data, onChange } = this.props;

    data[key] = Object.assign({}, data[key], { x, y });

    onChange && onChange(data);
  };

  handleChange = e => {
    const value = e.target.value;

    this.setState({ value });
  };

  handleDoubleClick = (key, item) => {
    let { data } = this.state;
    data[key] = item;
    data[key].editable = true;
    this.setState({ data });
  };

  render = () => {
    const { className, onChange, ...rest } = this.props;
    const { value, data } = this.state;

    return Object.keys(data).map(key => {
      const { x, y, style, editable = false } = data[key];

      if (editable) {
        return (
          <div
            className={classNames('TagGroup', className)}
            style={Object.assign({}, style, {
              transform: `translate(${x}px, ${y}px)`,
              background: '#F96',
            })}
            key={key}
            {...rest}
          >
            <Input onChange={this.handleChange} value={value} />
          </div>
        );
      }

      return (
        <Draggable
          onStop={(e, item) => this.handleStop(item, key)}
          key={key}
          position={{ x, y }}
          onDrag={e => onChange && onChange(data)}
        >
          <div
            className={classNames('TagGroup', className)}
            style={style}
            onDoubleClick={() => this.handleDoubleClick(key, data[key])}
            {...rest}
          >
            {value}
          </div>
        </Draggable>
      );
    });
  };
}
