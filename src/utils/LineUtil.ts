// const placements = ['top', 'bottom', 'left', 'right'];
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
export const getPlacement = (
  { x: x0, y: y0 }: { x: number; y: number },
  { x: x1, y: y1 }: { x: number; y: number },
) => {
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

const getRelativeOrigin = (
  target: { x: number; y: number },
  relative: { x: number; y: number },
) => {
  const { x: x0, y: y0 } = target;
  const { x: x1, y: y1 } = relative;

  return { x: x1 - x0, y: y1 - y0 };
};

export function preventDefault(e: any) {
  e.preventDefault();
}

export function stopPropagation(e: any) {
  e.stopPropagation();
}

export const generateKey = (name: string) => {
  return `${name}-${new Date().getTime() % 1000000}`;
};

export const getRelativeLinesByBlockKey = (blockKey: string, mapping: any) => {
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
