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
import omit from 'omit.js';

export type LineItem =
  | {
      x: number;
      y: number;
      bottom: number;
      height: number;
      left: number;
      right: number;
      top: number;
      width: number;
    }
  | DOMRect;
export type DataSource = {
  CanvasPosition?: {
    x: number;
    y: number;
    z: number;
    gap: number;
  };
  BlockGroup?: { [key: string]: { x: number; y: number } };
  TagGroup?: {
    [key: string]: {
      x: number;
      y: number;
      style?: React.CSSProperties;
      input: string;
      editable: boolean;
    };
  };
  LineGroup?: {
    [key: string]: {
      fromKey: string;
      toKey: string;
      from: LineItem;
      to: LineItem;
    };
  };
};
export interface CanvasProps {
  style?: any;
  className?: string;
  data?: DataSource;
  orientation?: 'h' | 'v' | 'horizonal' | 'vertical' | string;
  blockClassName?: string;
  tagClassName?: string;
  lineClassName?: string;
  onChange: (item: any) => void;
  onWheel?: (item: any, event?: any) => void;
}
export interface CanvasState {
  blockProps?: any;
  linesProps?: any;
  tagProps?: any;
  position: { x: number; y: number; z: number; gap: number };
}
export type ContextMenuProps = {
  event: Event;
  key: string;
  group: string;
};

const dataCollector: any = {};

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
    // hack
    // don't know why when change Input in TagGroup,
    // it would return an event object that unexpected
    if (Object.keys(data).length > 4) {
      return {
        blockProps: dataCollector.BlockGroup,
        tagProps: dataCollector.TagGroup,
        linesProps: dataCollector.LineGroup,
        position: dataCollector.CanvasPosition,
      };
    }
    if (Object.keys(data).length !== 0) {
      const {
        BlockGroup: blockProps,
        TagGroup: tagProps,
        LineGroup: linesProps,
        CanvasPosition,
      } = data;

      let position = nextState.position;
      if (position.x === 0 && position.y === 0 && CanvasPosition) {
        position = CanvasPosition;
        dataCollector.CanvasPosition = CanvasPosition;
      }
      return {
        blockProps,
        tagProps,
        linesProps,
        position,
      };
    }
    return null;
  }
  state: CanvasState = {
    blockProps: {},
    linesProps: {},
    tagProps: {},
    position: { x: 0, y: 0, z: 0, gap: 1 },
  };

  // to repaint Line instantly
  handleBlockChange = (blockProps: any, linesProps: any) => {
    this.handleUnityAllDatas(blockProps, 'BlockGroup');
    this.handleUnityAllDatas(linesProps, 'LineGroup');
    this.setState({ blockProps });
    if (linesProps) {
      this.setState({ linesProps });
    }
  };

  handleTagChange = (tagProps: any) => {
    this.handleUnityAllDatas(tagProps, 'TagGroup');
  };

  handleUnityAllDatas = (data?: any, type?: string) => {
    const { onChange } = this.props;
    if (data && type) {
      dataCollector[type] = data;
    }
    if (onChange) {
      onChange(dataCollector);
    }
  };

  onDrop = (e: any) => {
    let dragItem = e.dataTransfer.getData('dragItem');
    if (!dragItem) {
      return false;
    }
    dragItem = dragItem ? JSON.parse(dragItem) : {};
    const { value } = dragItem;
    const { blockProps, tagProps, position } = this.state;
    const { clientX, clientY } = e;
    let defaultWidth = 100;
    let defaultHeight = 80;

    switch (value) {
      case 'block':
        blockProps[generateKey('block')] = {
          x: clientX - defaultWidth / 2 - position.x,
          y: clientY - defaultHeight / 2 - position.y,
        };
        this.handleUnityAllDatas(blockProps, 'BlockGroup');
        this.setState({ blockProps });
        break;

      case 'input':
        defaultWidth = 100;
        defaultHeight = 32;
        tagProps[generateKey('tag')] = {
          x: clientX - defaultWidth / 2 - position.x,
          y: clientY - defaultHeight / 2 - position.y,
          editable: true,
        };
        this.handleUnityAllDatas(tagProps, 'TagGroup');
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
    const position = Object.assign({}, this.state.position, { x, y });
    this.handleUnityAllDatas(position, 'CanvasPosition');
    this.setState({ position });
  };

  handleDragStart = (e: any) => {
    stopPropagation(e);
  };

  handleRightClick = ({ key, event, group }: ContextMenuProps) => {
    preventDefault(event);
    delete dataCollector[group][key];
    for (const lineKey of Object.keys(dataCollector.LineGroup)) {
      const { fromKey, toKey } = dataCollector.LineGroup[lineKey];
      if (group === 'BlockGroup' && (fromKey === key || toKey === key)) {
        delete dataCollector.LineGroup[lineKey];
      }
    }
    this.handleUnityAllDatas();
    this.setState({});
  };

  handleOnWhell = (e: any) => {
    const { onWheel } = this.props;
    if (onWheel) {
      onWheel(dataCollector, e);
    }
  };

  render = () => {
    const {
      className,
      orientation,
      blockClassName,
      tagClassName,
      lineClassName,
      ...rest
    } = this.props;
    const { blockProps, linesProps, tagProps, position } = this.state;

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
          onWheel={this.handleOnWhell}
          {...omit(rest, ['onWheel'])}
        >
          <BlockGroup
            offset={position}
            data={blockProps}
            onChange={this.handleBlockChange}
            lineData={linesProps}
            className={blockClassName}
            onContextMenu={this.handleRightClick}
          />
          <LineGroup
            data={linesProps}
            offset={position}
            orientation={orientation}
            className={lineClassName}
          />
          <TagGroup
            data={tagProps}
            onChange={this.handleTagChange}
            className={tagClassName}
            onContextMenu={this.handleRightClick}
          />
        </div>
      </Draggable>
    );
  };
}
