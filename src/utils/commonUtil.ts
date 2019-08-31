import { BlockGroupProps, BlockGroupState } from '../tools/BlockGroup';
import { TagGroupProps, TagGroupState } from '../tools/TagGroup';

export function noop() {}

export const isSameCoordinate = (
  nextProps: BlockGroupProps | TagGroupProps,
  nextState: BlockGroupState | TagGroupState,
  currentKey?: string,
) => {
  if (!currentKey) {
    return false;
  }
  const currentProps = (nextProps.data as any)[currentKey];
  const currentState = (nextState.data as any)[currentKey];

  if (currentProps.x !== currentState.x || currentProps.y !== currentState.y) {
    return true;
  }

  return false;
};

export const convertDomRect2Object = (item: DOMRect | ClientRect) => {
  let x;
  let y;
  x = 'x' in item ? item.x : item.left;
  y = 'y' in item ? item.y : item.top;
  return {
    top: item.top,
    right: item.right,
    bottom: item.bottom,
    left: item.left,
    width: item.width,
    height: item.height,
    x,
    y,
  };
};
