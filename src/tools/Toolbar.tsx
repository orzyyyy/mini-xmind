import React from 'react';
import './css/Toolbar.css';

export type DraggableItemProp = 'block' | 'tag';

const draggableItem: {
  type: DraggableItemProp;
  item: React.ReactElement;
  key: string;
}[] = [
  { type: 'block', item: <div className="icon-border" />, key: 'toolbar-block' },
  { type: 'tag', item: <div className="icon-tag" />, key: 'toolbar-tag' },
];

const onDragStart = (e: React.DragEvent<HTMLLIElement>, item: { type: DraggableItemProp }) => {
  e.dataTransfer.effectAllowed = 'copy';
  e.dataTransfer.setData('dragItem', JSON.stringify(item));
};

const Toolbar = () => (
  <div className="Toolbar">
    <ul>
      <li>
        <div className="icon-minus" />
      </li>
      <li>
        <div className="icon-branches" />
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
