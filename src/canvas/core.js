import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import LineGroup from '../tools/LineGroup';
import { preventDefault, generateKey } from '../utils/LineUtil';
import BlockGroup from '../tools/BlockGroup';
import TagGroup from '../tools/TagGroup';

export default class Canvas extends Component {
  static propTypes = {
    style: PropTypes.object,
    className: PropTypes.string,
    data: PropTypes.object,
  };

  static defaultProps = {
    style: {},
    className: '',
    data: {},
  };

  static getDerivedStateFromProps(nextProps) {
    const data = nextProps.data;
    if (Object.keys(data) != 0) {
      const { BlockGroup, TagGroup } = data;

      return {
        blockProps: BlockGroup,
        tagProps: TagGroup,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);

    this.state = {
      blockProps: {},
      linesProps: {},
      tagProps: {},
    };
  }

  // to repaint Line instantly
  handleBlockChange = (blockProps, linesProps) => {
    this.setState({ blockProps });
    if (linesProps) {
      this.setState({ linesProps });
    }
  };

  handleTagChange = tagProps => {
    this.setState({ tagProps });
  };

  onDrop = e => {
    let dragItem = e.dataTransfer.getData('dragItem');
    if (!dragItem) {
      return;
    }
    dragItem = dragItem ? JSON.parse(dragItem) : {};
    const { value, style } = dragItem;
    let { blockProps, tagProps } = this.state;
    const { clientX, clientY } = e;
    const x = clientX - style.width / 2;
    const y = clientY - style.height / 2;

    switch (value) {
      case 'block':
        blockProps[generateKey('block')] = { x, y, style };
        this.setState({ blockProps });
        break;

      case 'line':
        break;

      case 'input':
        tagProps[generateKey('tag')] = { x, y, style, editable: true };
        this.setState({ tagProps });
        break;

      default:
        break;
    }
  };

  render = () => {
    const { className, ...rest } = this.props;
    const { blockProps, linesProps, tagProps } = this.state;

    return (
      <div
        className={classNames('Canvas', className)}
        onDragOver={preventDefault}
        onDrop={this.onDrop}
        {...rest}
      >
        <BlockGroup
          data={blockProps}
          onChange={this.handleBlockChange}
          lineData={linesProps}
        />
        <LineGroup data={linesProps} />
        <TagGroup data={tagProps} onChange={this.handleTagChange} />
      </div>
    );
  };
}
