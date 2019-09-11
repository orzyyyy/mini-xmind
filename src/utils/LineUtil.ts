//
// Generally speaking, `from` is the target, `to` is the relative
//
////////////////////////////////////////////////////////////////////
//   _________
//  |         |
//  | target  |
//  |_________|
//                         =======> bottom right
//                _____________
//               |            |
//               |  relative  |
//               |____________|
//
////////////////////////////////////////////////////////////////////
//                               _________
//                              |         |
//                              | target  |
//                              |_________|
//                                            =======> bottom left
//             _____________
//            |            |
//            |  relative  |
//            |____________|
//
////////////////////////////////////////////////////////////////////
//
//             _____________
//            |            |
//            |  relative  |
//            |____________|
//
//                                =======> top left
//                                       _________
//                                      |         |
//                                      | target  |
//                                      |_________|
//
////////////////////////////////////////////////////////////////////
//
//                                         _____________
//                                        |            |
//                                        |  relative  |
//                                        |____________|
//
//                                =======> top right
//
//                 __________
//                |         |
//                | target  |
//                |_________|
//
export const getPlacement = (
  { x: x0, y: y0 }: { x: number; y: number },
  { x: x1, y: y1 }: { x: number; y: number },
) => {
  let fromAnchor;
  let toAnchor;

  toAnchor = x0 > x1 ? 'left' : 'right';
  fromAnchor = y0 > y1 ? 'top' : 'bottom';

  return { fromAnchor, toAnchor };
};

export function preventDefault(e: any) {
  e.preventDefault();
}

export function stopPropagation(e: any) {
  e.stopPropagation();
}

export const generateKey = (name: 'block' | 'line' | 'tag') => {
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

// Firstly, the coordinate origin is at the top left
//
//   This is the coordinate origin
//        ___
//       |\
//         \
//          \
//           \_____________________
//           |                    |
//           |                    |
//           |                    |
//           |                    |
//           |                    |
//           |                    |
//           |____________________|
//
//
// Secondly, all calculation is based on this and should follow this forever
// Or it would be hard to read code below
//
export const getLineCoordinatesForVertical = (
  from: any,
  to: any,
  offset: any,
) => {
  let firstLineVisible = true;
  let secondLineVisible = true;
  let thirdLineVisible = true;

  const { toAnchor } = getPlacement(
    { x: from.x, y: from.y },
    { x: to.x, y: to.y },
  );

  const offsetX = window.pageXOffset - offset.x;
  const offsetY = window.pageYOffset - offset.y;

  const fromWidth = from.width || 0;
  const fromHeight = from.height || 0;
  const toWidth = to.width || 0;
  const toHeight = to.height || 0;
  const centerY = (from.y + to.y + fromHeight) / 2 + offsetY;

  let x0, x1, y0, y1;

  //
  //   ____________                                   ____________
  //  |           |                                  |           |
  //  |   from1   |                                  |   from2   |
  //  |           |                                  |           |
  //  |___________|                                  |___________|
  //        |                                             |
  //        |_____________________________________________|
  //                                |
  //                           _____|______
  //                          |           |
  //                          |    to     |
  //                          |           |
  //                          |___________|
  //                                |
  //                                |
  //         _______________________|______________________
  //        |                                             |
  //        |                                             |
  //   _____|______                                  _____|______
  //  |           |                                 |           |
  //  |   from3   |                                 |   from4   |
  //  |           |                                 |           |
  //  |___________|                                 |___________|
  //
  x0 = from.x + offsetX + fromWidth / 2;
  y0 = from.y + offsetY + fromHeight;
  x1 = to.x + offsetX + fromWidth / 2;
  y1 = to.y + offsetY;

  //
  //
  //         this is right
  //   ____________                                                 this is left
  //  |           |                       ____________
  //  |   from1   |______________________|           |                          _____________
  //  |           |                      |     to    |                         |            |
  //  |___________|                      |           |_________________________|   from2    |
  //                                     |___________|                         |            |
  //                                                                           |____________|
  //
  //
  //  If you don't know why `left` or `right`,
  //  check the comment of function `getPlacement`
  //
  if (
    from.y + fromHeight / 2 >= to.y - toHeight / 2 &&
    from.y - fromHeight / 2 <= to.y + toHeight / 2
  ) {
    if (toAnchor === 'right') {
      x0 = from.x + offsetX + fromWidth;
      y0 = from.y + offsetY + fromHeight / 2;
      x1 = to.x + offsetX;
      y1 = to.y + offsetY + toHeight / 2;
    } else if (toAnchor === 'left') {
      x0 = from.x + offsetX;
      y0 = from.y + offsetY + fromHeight / 2;
      x1 = to.x + offsetX + toWidth;
      y1 = to.y + offsetY + toHeight / 2;
    }
  }

  //
  //                           ____________
  //                          |           |
  //                     _____|    to     |______
  //                    |     |           |     |
  //                    |     |___________|     |
  //                    |                       |
  //   ____________     |                       |     ____________
  //  |           |     |                       |    |           |
  //  |   from1   |_____|                       |____|   from2   |
  //  |           |                                  |           |
  //  |___________|                                  |___________|
  //
  //
  if (from.y > to.y + toHeight) {
    x0 = from.x + offsetX + fromWidth / 2;
    y0 = from.y + offsetY;
    x1 = to.x + offsetX + toWidth / 2;
    y1 = to.y + offsetY + toHeight;
  }

  return {
    x0,
    x1,
    y0,
    y1,
    centerY,
    firstLineVisible,
    secondLineVisible,
    thirdLineVisible,
  };
};

// Firstly, the coordinate origin is at the top left
//
//   This is the coordinate origin
//        ___
//       |\
//         \
//          \
//           \_____________________
//           |                    |
//           |                    |
//           |                    |
//           |                    |
//           |                    |
//           |                    |
//           |____________________|
//
//
// Secondly, all calculation is based on this and should follow this forever
// Or it would be hard to read code below
//
export const getLineCoordinatesForHorizonal = (
  from: any,
  to: any,
  offset: any,
) => {
  let firstLineX0 = 0;
  let firstLineY0 = 0;
  let firstLineX1 = 0;
  let firstLineY1 = 0;

  let secondLineX0 = 0;
  let secondLineY0 = 0;
  let secondLineX1 = 0;
  let secondLineY1 = 0;

  let thirdLineX0 = 0;
  let thirdLineY0 = 0;
  let thirdLineX1 = 0;
  let thirdLineY1 = 0;

  const offsetX = window.pageXOffset - offset.x;
  const offsetY = window.pageYOffset - offset.y;

  const fromWidth = from.width || 0;
  const fromHeight = from.height || 0;
  const toWidth = to.width || 0;
  const toHeight = to.height || 0;

  const fromX = from.x + offsetX;
  const fromY = from.y + offsetY;
  const toX = to.x + offsetX;
  const toY = to.y + offsetY;

  //
  //   ____________
  //  |           |
  //  |   from    |______
  //  |           |     |
  //  |___________|     |
  //                    |
  //                    |
  //                    |
  //                    |      ____________
  //                    |     |           |
  //                    |_____|    to     |
  //                          |           |
  //                          |___________|
  //
  //
  if (from.x + fromWidth <= to.x) {
    firstLineX0 = fromX + fromWidth;
    firstLineY0 = fromY + fromHeight / 2;
    firstLineX1 = (fromX + fromWidth + toX) / 2;
    firstLineY1 = firstLineY0;

    secondLineX0 = firstLineX1;
    secondLineY0 = firstLineY1;
    secondLineX1 = firstLineX1;
    secondLineY1 = toY + toHeight / 2;

    thirdLineX0 = secondLineX1;
    thirdLineY0 = secondLineY1;
    thirdLineX1 = toX;
    thirdLineY1 = toY + toHeight / 2;
  }

  //
  //                             ____________
  //                            |           |
  //                      ______|   from    |
  //                     |      |           |
  //                     |      |___________|
  //                     |
  //                     |
  //                     |
  //     ____________    |
  //    |           |    |
  //    |    to     |____|
  //    |           |
  //    |___________|
  //
  if (from.x >= to.x + toWidth) {
    firstLineX0 = fromX;
    firstLineY0 = fromY + fromHeight / 2;
    firstLineX1 = (fromX + toX + toWidth) / 2;
    firstLineY1 = firstLineY0;

    secondLineX0 = firstLineX1;
    secondLineY0 = firstLineY1;
    secondLineX1 = firstLineX1;
    secondLineY1 = toY + toHeight / 2;

    thirdLineX0 = secondLineX1;
    thirdLineY0 = secondLineY1;
    thirdLineX1 = toX + toWidth;
    thirdLineY1 = toY + toHeight / 2;
  }

  //
  //    __________________
  //   |                 |
  //   |       from      |
  //   |                 |
  //   |_________________|
  //            |
  //            |___
  //               |
  //        _______|__________
  //       |                 |
  //       |       to        |
  //       |                 |
  //       |_________________|
  //
  if (
    fromX + fromWidth / 2 > toX &&
    fromX + fromWidth / 2 < toX + toWidth / 2 &&
    fromY + fromHeight < toY
  ) {
    firstLineX0 = fromX + fromWidth / 2;
    firstLineY0 = fromY + fromHeight;
    firstLineX1 = firstLineX0;
    firstLineY1 = (fromY + fromHeight + toY) / 2;

    secondLineX0 = firstLineX1;
    secondLineY0 = firstLineY1;
    secondLineX1 = toX + toWidth / 2;
    secondLineY1 = firstLineY1;

    thirdLineX0 = secondLineX1;
    thirdLineY0 = secondLineY1;
    thirdLineX1 = toX + toWidth / 2;
    thirdLineY1 = toY;
  }

  //
  //             __________________
  //            |                 |
  //            |       from      |
  //            |                 |
  //            |_________________|
  //                    |
  //                ____|
  //               |
  //        _______|__________
  //       |                 |
  //       |       to        |
  //       |                 |
  //       |_________________|
  //
  if (
    fromX + fromWidth / 2 > toX + toWidth / 2 &&
    fromX + fromWidth / 2 < toX + toWidth &&
    fromY + fromHeight < toY
  ) {
    firstLineX0 = fromX + fromWidth / 2;
    firstLineY0 = fromY + fromHeight;
    firstLineX1 = firstLineX0;
    firstLineY1 = (fromY + fromHeight + toY) / 2;

    secondLineX0 = firstLineX1;
    secondLineY0 = firstLineY1;
    secondLineX1 = toX + toWidth / 2;
    secondLineY1 = secondLineY0;

    thirdLineX0 = secondLineX1;
    thirdLineY0 = secondLineY1;
    thirdLineX1 = toX + toWidth / 2;
    thirdLineY1 = toY;
  }

  //
  //             __________________
  //            |                 |
  //            |       to        |
  //            |                 |
  //            |_________________|
  //                    |
  //                 ___|
  //                |
  //        ________|_________
  //       |                 |
  //       |      from       |
  //       |                 |
  //       |_________________|
  //
  if (
    fromX + fromWidth / 2 > toX &&
    fromX + fromWidth / 2 < toX + toWidth / 2 &&
    fromY > toY + toHeight
  ) {
    firstLineX0 = fromX + fromWidth / 2;
    firstLineY0 = fromY;
    firstLineX1 = firstLineX0;
    firstLineY1 = (fromY + fromHeight + toY) / 2;

    secondLineX0 = firstLineX1;
    secondLineY0 = firstLineY1;
    secondLineX1 = toX + toWidth / 2;
    secondLineY1 = firstLineY1;

    thirdLineX0 = secondLineX1;
    thirdLineY0 = secondLineY1;
    thirdLineX1 = toX + toWidth / 2;
    thirdLineY1 = toY + toHeight;
  }

  //
  //    __________________
  //   |                 |
  //   |       to        |
  //   |                 |
  //   |_________________|
  //            |
  //            |____
  //                |
  //        ________|_________
  //       |                 |
  //       |       from      |
  //       |                 |
  //       |_________________|
  //
  if (
    fromX + fromWidth / 2 > toX + toWidth / 2 &&
    fromX + fromWidth / 2 < toX + toWidth &&
    fromY > toY + toHeight
  ) {
    firstLineX0 = fromX + fromWidth / 2;
    firstLineY0 = fromY;
    firstLineX1 = firstLineX0;
    firstLineY1 = (fromY + fromHeight + toY) / 2;

    secondLineX0 = firstLineX1;
    secondLineY0 = firstLineY1;
    secondLineX1 = toX + toWidth / 2;
    secondLineY1 = secondLineY0;

    thirdLineX0 = secondLineX1;
    thirdLineY0 = secondLineY1;
    thirdLineX1 = toX + toWidth / 2;
    thirdLineY1 = toY + toHeight;
  }

  return {
    firstLineX0,
    firstLineY0,
    firstLineX1,
    firstLineY1,
    secondLineX0,
    secondLineY0,
    secondLineX1,
    secondLineY1,
    thirdLineX0,
    thirdLineY0,
    thirdLineX1,
    thirdLineY1,
  };
};
