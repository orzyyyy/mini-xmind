const placements = ['top', 'bottom', 'left', 'right'];
//   _________
//  |         |
//  | target  |
//  |_________|
//      |                  =======> bottom right
//      |    ____________
//      |___|            |
//          |  relative  |
//          |____________|
//
export const getPlacement = ({ x: x0, y: y0 }, { x: x1, y: y1 }) => {
  let fromAnchor, toAnchor;
  // when the origin is determined, relative need to
  // calculate relative coordinate
  const { x, y } = getRelativeOrigin({ x: x0, y: -y0 }, { x: x1, y: -y1 });

  // first quadrant
  if (x > 0 && y > 0) {
    if (x < y) {
      // top
      fromAnchor = 'top';
      toAnchor = 'bottom';
    } else if (x > y) {
      // bottom
      fromAnchor = 'top';
      toAnchor = 'left';
    }
  }

  // second quadrant
  if (x < 0 && y > 0) {
    if (-x < y) {
      // top
      fromAnchor = 'top';
      toAnchor = 'bottom';
    } else if (-x > y) {
      // bottom
      fromAnchor = 'top';
      toAnchor = 'right';
    }
  }

  // third quadrant
  if (x < 0 && y < 0) {
    if (x < y) {
      // top
      fromAnchor = 'bottom';
      toAnchor = 'right';
    } else if (x > y) {
      // bottom
      fromAnchor = 'bottom';
      toAnchor = 'top';
    }
  }

  // fourth quadrant
  if (x > 0 && y < 0) {
    if (x > -y) {
      // top
      fromAnchor = 'bottom';
      toAnchor = 'left';
    } else if (x < -y) {
      // bottom
      fromAnchor = 'bottom';
      toAnchor = 'right';
    }
  }

  return { fromAnchor, toAnchor };
};

const getRelativeOrigin = (target, relative) => {
  const { x: x0, y: y0 } = target;
  const { x: x1, y: y1 } = relative;

  return { x: x1 - x0, y: y1 - y0 };
};

export function preventDefault(e) {
  e.preventDefault();
}

export function stopPropagation(e) {
  e.stopPropagation();
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
