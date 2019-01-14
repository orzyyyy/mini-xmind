import React, { Component } from 'react';

import { Icon } from 'antd';
import { tools } from '../options/tools';

import './assets/Toolbar.css';

export default class Toolbar extends Component {
  static propTypes = {};

  static defaultProps = {};

  onDragStart = (e, item) => {
    e.dataTransfer.effectAllowed = 'copy';

    e.dataTransfer.setData('dragItem', JSON.stringify(item));
  };

  render = () => {
    return (
      <div className="Toolbar">
        <ul>
          {tools.map((item, i) => {
            const { key, value } = item;
            return (
              <li
                draggable
                onDragStart={e => this.onDragStart(e, item)}
                key={`tool-${i}`}
              >
                <Icon
                  type={key}
                  // onClick={() => this.handleIconClick(value)}
                  style={{
                    fontSize: 20,
                  }}
                />
              </li>
            );
          })}
        </ul>
      </div>
    );
  };
}
