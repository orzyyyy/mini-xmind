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
export const getPlacement = (
  { x: x0, y: y0 },
  { x: x1, y: y1 },
  width,
  height,
) => {
  let fromAnchor, toAnchor;

  // (x0, y0) is origin
  // { x: x0, y: y0 } must be the center of rectangle
  const target = getVertexs({ x: x0, y: y0 }, width, height);
  const targetFirstThirdQuadrantSlope = getSlopeByTwoPoints(
    target.topRight,
    target.bottomLeft,
  );
  const targetSecondFourthQuadrantSlope = getSlopeByTwoPoints(
    target.topLeft,
    target.bottomRight,
  );

  const relativeSlope = getSlopeByTwoPoints({ x: 0, y: 0 }, { x: x1, y: y1 });

  // Y-line right
  if (x1 > x0) {
    // first quadrant
    if (y1 > y0) {
      if (targetFirstThirdQuadrantSlope > relativeSlope) {
        // bottom
        fromAnchor = 'top';
        toAnchor = 'left';
      } else {
        // top
        fromAnchor = 'top';
        toAnchor = 'bottom';
      }
    } else {
      // fourth quadrant
      // eslint-disable-next-line no-lonely-if
      if (targetSecondFourthQuadrantSlope > relativeSlope) {
        // top
        fromAnchor = 'bottom';
        toAnchor = 'left';
      } else {
        // bottom
        fromAnchor = 'bottom';
        toAnchor = 'right';
      }
    }
  } else {
    // Y-line left
    // second quadrant
    // eslint-disable-next-line no-lonely-if
    if (y1 > y0) {
      if (targetSecondFourthQuadrantSlope > relativeSlope) {
        // top
        fromAnchor = 'top';
        toAnchor = 'bottom';
      } else {
        // bottom
        fromAnchor = 'top';
        toAnchor = 'right';
      }
    } else {
      // third quadrant
      // eslint-disable-next-line no-lonely-if
      if (targetFirstThirdQuadrantSlope > relativeSlope) {
        // bottom
        fromAnchor = 'bottom';
        toAnchor = 'top';
      } else {
        // top
        fromAnchor = 'bottom';
        toAnchor = 'right';
      }
    }
  }

  return { fromAnchor, toAnchor };
};

const getVertexs = (center, width, height) => {
  const { x, y } = center;
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  return {
    topLeft: { x: x - halfWidth, y: y - halfHeight },
    topRight: { x: x + halfWidth, y: y - halfHeight },
    bottomLeft: { x: x - halfWidth, y: y + halfHeight },
    bottomRight: { x: x + halfWidth, y: y + halfHeight },
  };
};

const getSlopeByTwoPoints = ({ x: x0, y: y0 }, { x: x1, y: y1 }) => {
  if (x0 === x1) {
    return;
  }

  return (y1 - y0) / (x1 - x0);
};

export const getCenterByTwoPoints = ({ x: x0, y: y0 }, { x: x1, y: y1 }) => {
  return { x: (x0 + x1) / 2, y: (y0 + y1) / 2 };
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
