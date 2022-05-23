import React from "react";
import Draggable, { DraggableEvent } from "react-draggable";
import { stopPropagation, preventDefault } from "../utils/LineUtil";
import "./css/BlockGroup.css";
import { ContextMenuProps, DataSource, CoordinatesProps } from "../canvas/core";
import { LineProps } from "./LineGroup";
import NinoZone, { getTargetDom } from "../canvas/nino-zone";
import classNames from "classnames";

export type BlockProps = {
  [blockKey: string]: CoordinatesProps & {
    children?: string[];
    className?: string;
  };
};
export interface BlockGroupProps {
  className?: string;
  data: BlockProps;
  lineData: LineProps;
  onChange: (data: DataSource, blockDOM: DataSource) => void;
  offset?: CoordinatesProps;
  onContextMenu: (item: ContextMenuProps) => void;
  onWheel: (
    data: BlockGroupProps,
    key: string,
    event: React.WheelEvent
  ) => void;
}
export interface BlockGroupState {
  data?: DataSource;
  lineData?: LineProps;
}

export const updateLineDataByTargetDom = (
  lineData: LineProps,
  targetDom: any = {}
) => {
  for (const key of Object.keys(lineData)) {
    const { fromKey, toKey } = lineData[key];
    for (const targetKey of Object.keys(targetDom)) {
      const value = targetDom[targetKey];
      if (fromKey === targetKey) {
        lineData[key].from = value;
      }
      if (toKey === targetKey) {
        lineData[key].to = value;
      }
    }
  }
  return lineData;
};

const handleDragStart = (e: DraggableEvent) => {
  stopPropagation(e);
  preventDefault(e);
};

const BlockGroup = ({
  className: parentClassName,
  data,
  onChange,
  lineData,
  onContextMenu,
  onWheel,
}: BlockGroupProps) => {
  const handleDrag = ({ x, y }: CoordinatesProps, blockKey: string) => {
    if (onChange) {
      onChange(
        Object.assign({}, data, { [blockKey]: { x, y } }),
        getTargetDom()
      );
    }
  };

  return (
    <>
      {Object.keys(data).map((blockKey) => {
        const { x, y, className: blockClassName } = data[blockKey];
        return (
          <Draggable
            position={{ x, y }}
            onDrag={(_: DraggableEvent, item: CoordinatesProps) =>
              handleDrag(item, blockKey)
            }
            onStart={handleDragStart}
            key={blockKey}
          >
            <div>
              <NinoZone
                className={classNames(
                  "block-group",
                  "animate-appear",
                  parentClassName,
                  blockClassName
                )}
                targetKey={blockKey}
                data={data}
                lineData={lineData}
                onContextMenu={onContextMenu}
                name="block-group"
                onChange={onChange}
                key={`nino-zone-${blockKey}`}
                onWheel={onWheel}
              />
            </div>
          </Draggable>
        );
      })}
    </>
  );
};

export default BlockGroup;
