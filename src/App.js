import React, { Component, Fragment } from 'react';

import { Icon } from 'antd';
import Draggable from 'react-draggable';
import { SteppedLineTo, Block } from './DrawLine';
import { ajax } from './urlHelper';

import './app.css';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tools: [],
      toolInstance: [],
      lineActive: false,
    };
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

    switch (value) {
      case 'border':
        toolInstance.push(
          <Draggable
            onStop={this.handleStop}
            key={`border-${toolInstance.length + 1}`}
            disabled={lineActive}
          >
            <div
              className="tool-border"
              style={Object.assign({}, style, {
                left: clientX - style.width / 2,
                top: clientY - style.height / 2,
              })}
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
        <Block className="stepped-A" top="50px" left="90px" color="#00f">
          A
        </Block>
        <Block className="stepped-B" top="150px" left="20px" color="#00f">
          B
        </Block>
        <Block className="stepped-C" top="150px" left="90px" color="#00f">
          C
        </Block>
        <Block className="stepped-D" top="150px" left="160px" color="#00f">
          D
        </Block>
        <Block className="stepped-E" top="50px" left="300px" color="#00f">
          E
        </Block>
        <Block className="stepped-F" top="120px" left="300px"
        color="#00f">
          F
        </Block>
        <SteppedLineTo
          from="stepped-A"
          to="stepped-B"
          fromAnchor="bottom"
          toAnchor="top"
          {...style}
        />
        <SteppedLineTo
          from="stepped-A"
          to="stepped-C"
          fromAnchor="bottom"
          toAnchor="top"
          {...style}
        />
        <SteppedLineTo
          from="stepped-A"
          to="stepped-D"
          fromAnchor="bottom"
          toAnchor="top"
          {...style}
        />
        <SteppedLineTo
          from="stepped-A"
          to="stepped-E"
          fromAnchor="right"
          toAnchor="left"
          orientation="h"
          {...style}
        />
        <SteppedLineTo
          from="stepped-A"
          to="stepped-F"
          fromAnchor="right"
          toAnchor="left"
          orientation="h"
          {...style}
        />
        <ul>
          {tools.map((item, i) => {
            const { key, value } = item;
            return (
              <li
                draggable
                onDragStart={e => this.onDragStart(e, item)}
                // onDrag={this.onDrag}
                key={`tool-${i}`}
              >
                <Icon
                  type={key}
                  onClick={() => this.handleIconClick(value)}
                  style={{ color: lineActive ? 'blue' : '', fontSize: 20 }}
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
