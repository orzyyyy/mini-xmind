const placements = ['top', 'bottom', 'Left', 'Right'];

// e.g. relative 在 target 的 bottomRight
export const getPlacement = (target, relative) => {
  let placement = '';
  let fromAnchor, toAnchor;
  const { x: targetX, y: targetY } = target;
  const { x: relativeX, y: relativeY } = relative;

  if (targetY < relativeY) {
    placement += placements[1];
    fromAnchor = placements[1];
    toAnchor = placements[0];
  } else {
    placement += placements[0];
    fromAnchor = placements[0];
    toAnchor = placements[1];
  }

  if (targetX < relativeX) {
    placement += placements[3];
  } else {
    placement += placements[2];
  }

  return { placement, fromAnchor, toAnchor };
};

export function preventDefault(e) {
  e.preventDefault();
}

export const generateKey = name => {
  return `${name}-${new Date().getTime() % 1000000}`;
};
