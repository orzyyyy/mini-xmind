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
    };
  }

  componentDidMount = () => {};

  handleStop = ({ x, y }, key) => {
    const { data, onChange } = this.props;

    data[key] = Object.assign({}, data[key], { x, y });

    onChange && onChange(data);
  };

  handleChange = (value, key, item) => {
    let { data } = this.state;
    data[key] = item;
    data[key].input = value;
    this.setState({ data });
  };

  handleEditable = (key, item, editable) => {
    let { data } = this.state;
    data[key] = item;
    data[key].editable = editable;
    this.setState({ data });
  };

  render = () => {
    const { className, onChange, ...rest } = this.props;
    const { data } = this.state;

    return Object.keys(data).map(key => {
      const { x, y, style, editable } = data[key];

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
            <Input
              className="animate-appear"
              onChange={e => this.handleChange(e.target.value, key, data[key])}
              value={data[key].input}
              autoFocus
              onBlur={() => this.handleEditable(key, data[key], false)}
            />
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
            className={classNames('TagGroup', className, 'animate-appear')}
            style={style}
            onDoubleClick={() => this.handleEditable(key, data[key], true)}
            {...rest}
          >
            {data[key].input}
          </div>
        </Draggable>
      );
    });
  };
}
