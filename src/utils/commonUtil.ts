export function noop() {}

export const isSameCoordinate = (nextProps, nextState, currentKey) => {
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
