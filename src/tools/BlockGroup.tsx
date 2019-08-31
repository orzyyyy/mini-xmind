import React from 'react';
import Draggable from 'react-draggable';
import { stopPropagation, preventDefault } from '../utils/LineUtil';
import './css/BlockGroup.css';
import { ContextMenuProps, DataSource } from '../canvas/core';
import { LineProps } from './LineGroup';
import NinoZone, { getTargetDom } from '../canvas/nino-zone';
import classNames from 'classnames';

export type BlockProps = { [blockKey: string]: { x: number; y: number } };
export interface BlockGroupProps {
  className?: string;
  data: BlockProps;
  lineData: LineProps;
  onChange: (data: DataSource, blockDOM: any) => void;
  offset?: { x: number; y: number };
  onContextMenu: (item: ContextMenuProps) => void;
}
export interface BlockGroupState {
  data?: DataSource;
  lineData?: LineProps;
}

export const updateLineDataByTargetDom = (
  lineData: LineProps,
  targetBlockDOM: any,
) => {
  for (const key of Object.keys(lineData)) {
    const { fromKey, toKey } = lineData[key];
    for (const blockKey of Object.keys(targetBlockDOM)) {
      const value = targetBlockDOM[blockKey];
      if (fromKey === blockKey) {
        lineData[key].from = value;
      }
      if (toKey === blockKey) {
        lineData[key].to = value;
      }
    }
  }
  return lineData;
};

const handleDragStart = (e: any) => {
  stopPropagation(e);
  preventDefault(e);
};

const BlockGroup = ({
  className: parentClassName,
  data,
  onChange,
  lineData,
  onContextMenu,
}: BlockGroupProps) => {
  const handleDrag = ({ x, y }: { x: number; y: number }, blockKey: string) => {
    if (onChange) {
      onChange(
        Object.assign({}, data, { [blockKey]: { x, y } }),
        getTargetDom(),
      );
    }
  };

  return (
    <>
      {Object.keys(data).map(blockKey => {
        const { x, y, className: blockClassName } = (data as any)[blockKey];
        return (
          <Draggable
            position={{ x, y }}
            onDrag={(_, item) => handleDrag(item, blockKey)}
            onStart={handleDragStart}
            key={blockKey}
          >
            <div>
              <NinoZone
                className={classNames(
                  'block-group',
                  'animate-appear',
                  parentClassName,
                  blockClassName,
                )}
                targetKey={blockKey}
                data={data}
                lineData={lineData}
                onContextMenu={onContextMenu}
                name="block-group"
                onChange={onChange}
                key={`nino-zone-${blockKey}`}
              />
            </div>
          </Draggable>
        );
      })}
    </>
  );
};

export default BlockGroup;
