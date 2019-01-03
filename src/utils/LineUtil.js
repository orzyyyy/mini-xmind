const placements = ['top', 'bottom', 'Left', 'Right'];

//   _________
//  |         |
//  | target  |
//  |_________|
//      |                  =======> bottomRight
//      |    ____________
//      |___|            |
//          |  relative  |
//          |____________|
//
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

export const getRelativeLinesByBlockKey = (blockKey, mapping) => {
  let lineKeys = [];

  for (let key in mapping) {
    const value = mapping[key];
    const { fromKey, toKey } = value;

    if (blockKey == fromKey || blockKey == toKey) {
      lineKeys.push(key);
    }
  }
  lineKeys = Array.from(new Set(lineKeys));

  return lineKeys;
};
