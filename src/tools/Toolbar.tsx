import React from 'react';
import { Minus, Border, Tag } from '@ant-design/icons';
import './css/Toolbar.css';

const onDragStart = (e: any, item: any) => {
  e.dataTransfer.effectAllowed = 'copy';
  e.dataTransfer.setData('dragItem', JSON.stringify(item));
};

const Toolbar = () => (
  <div className="Toolbar">
    <ul>
      <li draggable onDragStart={e => onDragStart(e, { type: 'line' })}>
        <Minus />
      </li>
      <li draggable onDragStart={e => onDragStart(e, { type: 'block' })}>
        <Border />
      </li>
      <li draggable onDragStart={e => onDragStart(e, { type: 'tag' })}>
        <Tag />
      </li>
    </ul>
  </div>
);

export default Toolbar;
