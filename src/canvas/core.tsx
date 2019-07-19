import React, { Component } from 'react';
import classNames from 'classnames';
import LineGroup, { LineProps } from '../tools/LineGroup';
import {
  preventDefault,
  generateKey,
  stopPropagation,
} from '../utils/LineUtil';
import TagGroup, { TagGroupItem } from '../tools/TagGroup';
import BlockGroup, { BlockProps } from '../tools/BlockGroup';
import Draggable from 'react-draggable';
import omit from 'omit.js';

export type CanvasPositionProps = {
  x: number;
  y: number;
  z: number;
  gap: number;
};
export type DataSource = {
  CanvasPosition?: CanvasPositionProps;
  BlockGroup?: BlockProps;
  TagGroup?: TagGroupItem;
  LineGroup?: LineProps;
};
export interface CanvasProps {
  className?: string;
  data?: DataSource;
  orientation?: 'h' | 'v' | 'horizonal' | 'vertical';
  blockClassName?: string;
  tagClassName?: string;
  lineClassName?: string;
  onChange?: (item: DataSource) => void;
  onWheel?: (item: DataSource, event?: any) => void;
  onClick?: () => void;
}
export interface CanvasState {
  blockProps?: BlockProps;
  linesProps?: LineProps;
  tagProps?: any;
  position: CanvasPositionProps;
}
export type ContextMenuProps = {
  event: Event;
  key: string;
  group: string;
};

const defaultDataSource = {
  CanvasPosition: { x: 0, y: 0, z: 0, gap: 1 },
  BlockGroup: {},
  TagGroup: {},
  LineGroup: {},
};
const dataCollector: any = {};

export default class Canvas extends Component<CanvasProps, CanvasState> {
  static defaultProps = {
    style: {},
    className: '',
    data: defaultDataSource,
    orientation: 'h',
  };

  static getDerivedStateFromProps(
    nextProps: CanvasProps,
    nextState: CanvasState,
  ) {
    const data = nextProps.data || defaultDataSource;
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

  blockGroupRef: BlockGroup;

  // to repaint Line instantly
  handleBlockChange = (blockProps: BlockProps, linesProps: LineProps) => {
    this.handleUnityAllDatas(blockProps, 'BlockGroup');
    this.handleUnityAllDatas(linesProps, 'LineGroup');
    this.setState({ blockProps });
  };

  handleTagChange = (tagProps: any) => {
    this.handleUnityAllDatas(tagProps, 'TagGroup');
    this.setState({ tagProps });
  };

  handleUnityAllDatas = (
    data?: BlockProps | TagGroupItem | LineProps | CanvasPositionProps,
    type?: string,
  ) => {
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
        if (blockProps) {
          blockProps[generateKey('block')] = {
            x: clientX - defaultWidth / 2 - position.x,
            y: clientY - defaultHeight / 2 - position.y,
          };
          this.handleUnityAllDatas(blockProps, 'BlockGroup');
          this.setState({ blockProps });
        }
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
    this.blockGroupRef.cleanCheckBlockClickList();
    stopPropagation(e);
  };

  handleRightClick = ({ key, event, group }: ContextMenuProps) => {
    preventDefault(event);
    delete dataCollector[group][key];
    if (!dataCollector.LineGroup) {
      return;
    }
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
          {...omit(rest, ['onWheel', 'onChange'])}
        >
          <BlockGroup
            offset={position}
            data={blockProps}
            onChange={this.handleBlockChange}
            lineData={linesProps}
            className={blockClassName}
            onContextMenu={this.handleRightClick}
            renderLine={lineData => (
              <LineGroup
                data={lineData}
                offset={position}
                orientation={orientation}
                className={lineClassName}
              />
            )}
            ref={ref => ref && (this.blockGroupRef = ref)}
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
