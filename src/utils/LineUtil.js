const placements = ['top', 'bottom', 'Left', 'Right'];

// e.g. relative 在 target 的 bottomRight
export const getPlacement = (target, relative) => {
  let placement = '';
  let from = '';
  let to = '';
  const { x: targetX, y: targetY } = target;
  const { x: relativeX, y: relativeY } = relative;

  if (targetY < relativeY) {
    placement += placements[1];
    from = placements[1];
    to = placements[0];
  } else {
    placement += placements[0];
    from = placements[0];
    to = placements[1];
  }

  if (targetX < relativeX) {
    placement += placements[3];
  } else {
    placement += placements[2];
  }

  return { placement, from, to };
};

export function preventDefault(e) {
  e.preventDefault();
}
