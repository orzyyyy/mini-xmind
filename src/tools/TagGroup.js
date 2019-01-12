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

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = () => {};

  handleStop = ({ x, y }, key) => {
    const { data, onChange } = this.props;

    data[key] = Object.assign({}, data[key], { x, y });

    onChange && onChange(data);
  };

  render = () => {
    const { data, className, onChange, ...rest } = this.props;

    return Object.keys(data).map(key => {
      const { x, y, style } = data[key];
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
            {...rest}
          >
            <Input />
          </div>
        </Draggable>
      );
    });
  };
}
