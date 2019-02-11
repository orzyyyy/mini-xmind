import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SteppedLineTo } from '../line';
import omit from 'omit.js';

export default class LineGroup extends Component {
  static propTypes = {
    data: PropTypes.object,
  };

  static defaultProps = {
    data: {},
  };

  static getDerivedStateFromProps(nextProps) {
    const data = nextProps.data;
    const newState = {};
    for (let key in data) {
      const { from, to } = data[key];

      if (from && to) {
        newState[key] = data[key];
      } else {
        break;
      }
    }

    return { data: newState };
  }

  constructor(props) {
    super(props);

    this.state = {
      data: {},
    };
  }

  generateLines = data => {
    const { offset, ...rest } = this.props;
    return Object.keys(data).map(lineKey => {
      const { from, to } = data[lineKey];

      DataCollector.set('LineGroup', {
        [lineKey]: omit(data[lineKey], ['from', 'to']),
      });
      return (
        <SteppedLineTo
          from={from}
          to={to}
          key={lineKey}
          offset={offset}
          className="animate-appear"
          {...rest}
        />
      );
    });
  };

  render = () => {
    const { data } = this.state;

    if (Object.keys(data).length == 0) {
      return null;
    }

    return <div className="LineGroup">{this.generateLines(data)}</div>;
  };
}
