import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SteppedLineTo } from '../line';

export default class LineGroup extends Component {
  static propTypes = {
    data: PropTypes.object,
  };

  static defaultProps = {
    data: {},
  };

  generateLines = data =>
    Object.keys(data).map(lineKey => {
      const { from, to, key } = data[lineKey];

      return <SteppedLineTo from={from} to={to} key={key} orientation="v" />;
    });

  render = () => {
    const { data } = this.props;

    return <div className="LineGroup">{this.generateLines(data)}</div>;
  };
}
