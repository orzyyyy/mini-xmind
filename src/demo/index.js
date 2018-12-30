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
              ref={ref => (this[blockKey] = ref)}
              style={Object.assign({}, style, {
                left: clientX - style.width / 2,
                top: clientY - style.height / 2,
                position: 'absolute',
              })}
              onClick={e => this.handleBlockClick(e, blockKey)}
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

    this.blocks[key] = {};

    return key;
  };

  handleBlockClick = (e, blockKey) => {
    const { lineBlockList } = this;

    lineBlockList.push(blockKey);

    if (lineBlockList.length == 2) {
      let { toolInstance } = this.state;

      toolInstance.push(
        <SteppedLineTo
          from={this.lineBlockList[0]}
          to={this.lineBlockList[1]}
          fromAnchor="bottom"
          toAnchor="top"
          style={{
            borderColor: '#ddd',
            borderStyle: 'solid',
            borderWidth: 3,
          }}
        />,
      );

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
    const style = {
      delay: true,
      borderColor: '#ddd',
      borderStyle: 'solid',
      borderWidth: 3,
    };

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
