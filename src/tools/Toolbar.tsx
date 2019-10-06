import React from 'react';
import { Minus, Border, Tag } from '@ant-design/icons';
import './css/Toolbar.css';

const renderItem = [
  { type: 'line', item: <Minus />, key: 'toolbar-line' },
  { type: 'block', item: <Border />, key: 'toolbar-block' },
  { type: 'tag', item: <Tag />, key: 'toolbar-tag' },
];

const onDragStart = (e: any, item: any) => {
  e.dataTransfer.effectAllowed = 'copy';
  e.dataTransfer.setData('dragItem', JSON.stringify(item));
};

const Toolbar = () => (
  <div className="Toolbar">
    <ul>
      {renderItem.map(({ type, item, key }) => (
        <li draggable onDragStart={e => onDragStart(e, { type })} key={key}>
          {item}
        </li>
      ))}
    </ul>
  </div>
);

export default Toolbar;
