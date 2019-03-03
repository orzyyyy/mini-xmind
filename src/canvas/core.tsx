import React, { Component } from 'react';
import classNames from 'classnames';
import LineGroup from '../tools/LineGroup';
import {
  preventDefault,
  generateKey,
  stopPropagation,
} from '../utils/LineUtil';
import { TagGroup, BlockGroup } from '../tools';
import Draggable from 'react-draggable';

export interface CanvasProps {
  style?: any;
  className?: string;
  data?: any;
  orientation?: 'h' | 'v' | 'horizonal' | 'vertical' | string;
  blockClassName?: string;
  tagClassName?: string;
}
export interface CanvasState {
  blockProps?: any;
  linesProps?: any;
  tagProps?: any;
  position: { x: number; y: number };
}

export default class Canvas extends Component<CanvasProps, CanvasState> {
  static defaultProps = {
    style: {},
    className: '',
    data: {},
    orientation: 'h',
  };

  static getDerivedStateFromProps(
    nextProps: CanvasProps,
    nextState: CanvasState,
  ) {
    const data = nextProps.data || {};
    if (Object.keys(data).length !== 0) {
      const { BlockGroup, TagGroup, LineGroup, CanvasPosition } = data;

      let position = nextState.position;
      if (position.x == 0 && position.y == 0 && CanvasPosition) {
        position = CanvasPosition;
      }

      return {
        blockProps: BlockGroup,
        tagProps: TagGroup,
        linesProps: LineGroup,
        position,
      };
    }
    return null;
  }

  constructor(props: CanvasProps) {
    super(props);

    this.state = {
      blockProps: {},
      linesProps: {},
      tagProps: {},
      position: { x: 0, y: 0 },
    };
  }

  // to repaint Line instantly
  handleBlockChange = (blockProps: any, linesProps: any) => {
    this.setState({ blockProps });
    if (linesProps) {
      this.setState({ linesProps });
    }
  };

  handleTagChange = (tagProps: any) => {
    this.setState({ tagProps });
  };

  onDrop = (e: any) => {
    let dragItem = e.dataTransfer.getData('dragItem');
    if (!dragItem) {
      return false;
    }
    dragItem = dragItem ? JSON.parse(dragItem) : {};
    const { value } = dragItem;
    let { blockProps, tagProps, position } = this.state;
    const { clientX, clientY } = e;
    let defaultWidth = 100;
    let defaultHeight = 80;

    switch (value) {
      case 'block':
        blockProps[generateKey('block')] = {
          x: clientX - defaultWidth / 2 - position.x,
          y: clientY - defaultHeight / 2 - position.y,
        };
        this.setState({ blockProps });
        break;

      case 'line':
        break;

      case 'input':
        defaultWidth = 100;
        defaultHeight = 32;
        tagProps[generateKey('tag')] = {
          x: clientX - defaultWidth / 2 - position.x,
          y: clientY - defaultHeight / 2 - position.y,
          editable: true,
        };
        this.setState({ tagProps });
        break;

      default:
        break;
    }
    return {
      x: clientX - defaultWidth / 2 - position.x,
      y: clientY - defaultHeight / 2 - position.y,
    };
  };

  handleDrag = (_: any, { x, y }: { x: number; y: number }) => {
    this.setState({ position: { x, y } });
  };

  handleDragStart = (e: any) => {
    stopPropagation(e);
  };

  render = () => {
    const {
      className,
      orientation,
      blockClassName,
      tagClassName,
      ...rest
    } = this.props;
    const { blockProps, linesProps, tagProps, position } = this.state;

    (window as any).DataCollector.set('CanvasPosition', position);
    return (
      <Draggable
        onDrag={this.handleDrag}
        position={position}
        onStart={this.handleDragStart}
      >
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
            className={blockClassName}
          />
          <LineGroup
            data={linesProps}
            offset={position}
            orientation={orientation}
          />
          <TagGroup
            data={tagProps}
            onChange={this.handleTagChange}
            className={tagClassName}
          />
        </div>
      </Draggable>
    );
  };
}
