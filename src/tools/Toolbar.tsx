import React from 'react';
import { Minus, Border, Tag, Branches } from '@ant-design/icons';
import './css/Toolbar.css';

export type DraggableItemProp = 'block' | 'tag';

const draggableItem: {
  type: DraggableItemProp;
  item: React.ReactElement;
  key: string;
}[] = [{ type: 'block', item: <Border />, key: 'toolbar-block' }, { type: 'tag', item: <Tag />, key: 'toolbar-tag' }];

const onDragStart = (e: React.DragEvent<HTMLLIElement>, item: { type: DraggableItemProp }) => {
  e.dataTransfer.effectAllowed = 'copy';
  e.dataTransfer.setData('dragItem', JSON.stringify(item));
};

const Toolbar = () => (
  <div className="Toolbar">
    <ul>
      <li>
        <Minus />
      </li>
      <li>
        <Branches />
      </li>
      {draggableItem.map(({ type, item, key }) => (
        <li draggable onDragStart={e => onDragStart(e, { type })} key={key}>
          {item}
        </li>
      ))}
    </ul>
  </div>
);

export default Toolbar;
