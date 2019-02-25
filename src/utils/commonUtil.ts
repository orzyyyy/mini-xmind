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
  const currentProps = nextProps.data[currentKey];
  const currentState = nextState.data[currentKey];

  if (currentProps.x != currentState.x || currentProps.y != currentState.y) {
    return true;
  }

  return false;
};
