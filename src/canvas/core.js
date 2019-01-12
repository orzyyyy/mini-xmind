import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import LineGroup from '../tools/LineGroup';
import { preventDefault, generateKey } from '../utils/LineUtil';
import BlockGroup from '../tools/BlockGroup';

export default class Canvas extends Component {
  static propTypes = {
    style: PropTypes.object,
    className: PropTypes.string,
  };

  static defaultProps = {
    style: {},
    className: '',
  };

  constructor(props) {
    super(props);

    this.state = {
      blockProps: {},
      linesProps: {},
    };
  }

  // to repaint Line instantly
  handleChange = (blockProps, linesProps) => {
    this.setState({ blockProps });
    if (linesProps) {
      this.setState({ linesProps });
    }
  };

  onDrop = e => {
    let dragItem = e.dataTransfer.getData('dragItem');
    if (!dragItem) {
      return;
    }
    dragItem = dragItem ? JSON.parse(dragItem) : {};
    const { value, style } = dragItem;
    let { blockProps } = this.state;
    const { clientX, clientY } = e;
    const blockKey = generateKey('block');
    const x = clientX - style.width / 2;
    const y = clientY - style.height / 2;

    switch (value) {
      case 'block':
        blockProps[blockKey] = { x, y, style };
        break;

      case 'line':
        break;

      case 'input':
        break;

      default:
        break;
    }
    this.setState({ blockProps });
  };

  render = () => {
    const { className, ...rest } = this.props;
    const { blockProps, linesProps } = this.state;

    return (
      <div
        className={classNames('Canvas', className)}
        onDragOver={preventDefault}
        onDrop={this.onDrop}
        {...rest}
      >
        <BlockGroup
          data={blockProps}
          onChange={this.handleChange}
          lineData={linesProps}
        />
        <LineGroup data={linesProps} />
      </div>
    );
  };
}
