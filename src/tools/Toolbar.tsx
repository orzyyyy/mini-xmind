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
      <li draggable onDragStart={e => onDragStart(e, { value: 'line' })}>
        <Minus />
      </li>
      <li draggable onDragStart={e => onDragStart(e, { value: 'block' })}>
        <Border />
      </li>
      <li
        draggable
        onDragStart={e => onDragStart(e, { value: 'tag', editable: true })}
      >
        <Tag />
      </li>
    </ul>
  </div>
);

export default Toolbar;
