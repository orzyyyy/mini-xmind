import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import './assets/Block.css';

export default class Block extends Component {
  static propTypes = {
    className: PropTypes.string,
  };

  static defaultProps = {
    className: '',
  };

  render() {
    const { className, ...rest } = this.props;
    return <div className={classNames('Block', className)} {...rest} />;
  }
}
