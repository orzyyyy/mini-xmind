import React, { Component, Fragment } from 'react';

import { Icon } from 'antd';
import Draggable from 'react-draggable';
import { SteppedLineTo, Block } from '../DrawLine';
import { ajax } from '../urlHelper';
import moment from 'moment';

import './assets/app.css';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tools: [],
      toolInstance: [],
      lineActive: false,
    };

    this.blocks = {};
    this.lineBlockList = []; // 用于连线，一般是两点一线
  }

  componentDidMount = () => {
    ajax({
      key: 'tools',
      success: tools => {
        this.setState({ tools });
      },
    });
  };

  onDragStart = (e, item) => {
    e.dataTransfer.effectAllowed = 'copy';

    e.dataTransfer.setData('dragItem', JSON.stringify(item));
  };

  onDrag = e => {};

  handleStop = e => {};

  handleIconClick = value => {
    const { lineActive } = this.state;

    switch (value) {
      case 'line':
        this.setState({ lineActive: !lineActive });
        break;

      default:
        break;
    }
  };

  onDrop = e => {
    let dragItem = e.dataTransfer.getData('dragItem');
    dragItem = dragItem ? JSON.parse(dragItem) : {};
    const { value, style } = dragItem;
    let { toolInstance, lineActive } = this.state;
    const { clientX, clientY } = e;
    const blockKey = this.generateBlockKey();
    const x = clientX - style.width / 2;
    const y = clientY - style.height / 2;
    this.blocks[blockKey] = { x, y };

    switch (value) {
      case 'border':
        toolInstance.push(
          <Draggable
            onStop={this.handleStop}
            key={`border-${toolInstance.length + 1}`}
            disabled={lineActive}
            // position={{ x: clientX - style.width / 2, y: clientY - style.height / 2 }}
          >
            <Block
              className={blockKey}
              key={blockKey}
              style={Object.assign({}, style, {
                left: x,
                top: y,
                position: 'absolute',
              })}
              onClick={e => this.handleBlockClick(blockKey)}
            />
          </Draggable>,
        );
        break;

      case 'line':
        break;

      default:
        break;
    }
    this.setState({ toolInstance });
  };

  generateBlockKey = () => {
    let key = moment().format('YYYYMMDDHHmmss');

    return key;
  };

  // e.g. relative 在 target 的 bottomRight
  getPlacement = (target, relative) => {
    let result = {};
    let placement = '';
    let from = '';
    let to = '';
    const { x: targetX, y: targetY } = target;
    const { x: relativeX, y: relativeY } = relative;

    if (targetY < relativeY) {
      placement += 'bottom';
      from = 'bottom';
      to = 'top';
    } else {
      placement += 'top';
      from = 'top';
      to = 'bottom';
    }

    if (targetX < relativeX) {
      placement += 'Right';
    } else {
      placement += 'Left';
    }

    return { placement, from, to };
  };

  handleBlockClick = blockKey => {
    const { lineBlockList } = this;

    lineBlockList.push(blockKey);

    if (lineBlockList.length == 2) {
      let { toolInstance } = this.state;
      const { from, to } = this.getPlacement(
        this.blocks[lineBlockList[0]],
        this.blocks[lineBlockList[1]],
      );

      toolInstance.push(
        <SteppedLineTo
          from={lineBlockList[0]}
          to={lineBlockList[1]}
          fromAnchor={from}
          toAnchor={to}
        />,
      );
      this.lineBlockList = [];

      this.setState({ toolInstance });
    }
  };

  onDragEnter = e => {
    e.dataTransfer.effectAllowed = 'none';
  };

  preventDefault(e) {
    e.preventDefault();
  }

  render = () => {
    const { tools, toolInstance, lineActive } = this.state;

    return (
      <Fragment>
        <ul>
          {tools.map((item, i) => {
            const { key, value, isBind } = item;
            return (
              <li
                draggable
                onDragStart={e => this.onDragStart(e, item)}
                // onDrag={this.onDrag}
                key={`tool-${i}`}
              >
                <Icon
                  type={key}
                  onClick={() => isBind && this.handleIconClick(value)}
                  style={{
                    color: isBind && lineActive ? 'blue' : '',
                    fontSize: 20,
                  }}
                />
              </li>
            );
          })}
        </ul>
        <div
          className="App"
          onDragOver={this.preventDefault}
          onDrop={this.onDrop}
        >
          {toolInstance}
        </div>
      </Fragment>
    );
  };
}
