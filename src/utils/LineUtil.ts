//   _________
//  |         |
//  | from    |
//  |_________|
//                         =======> bottom right
//                _____________
//               |            |
//               |     to     |
//               |____________|
//
////////////////////////////////////////////////////////////////////
//                               _________
//                              |         |
//                              |   from  |
//                              |_________|
//                                            =======> bottom left
//             _____________
//            |            |
//            |     to     |
//            |____________|
//
////////////////////////////////////////////////////////////////////
//
//             _____________
//            |            |
//            |     to     |
//            |____________|
//
//                                =======> top left
//                                       _________
//                                      |         |
//                                      |   from  |
//                                      |_________|
//
////////////////////////////////////////////////////////////////////
//
//                                         _____________
//                                        |            |
//                                        |     to     |
//                                        |____________|
//
//                                =======> top right
//
//                 __________
//                |         |
//                |   from  |
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
  //
  if (fromY + fromHeight < toY) {
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
  //
  //
  //   ____________
  //  |           |                       ____________
  //  |    from   |___________           |           |
  //  |           |          |___________|     to    |
  //  |___________|                      |           |
  //                                     |___________|
  //
  //
  if (
    fromY + fromHeight > toY &&
    fromY - fromHeight / 2 < toY + toHeight &&
    fromX + fromWidth < toX
  ) {
    firstLineX0 = fromX + fromWidth;
    firstLineY0 = fromY + fromHeight / 2;
    firstLineX1 = (fromX + fromWidth + toX) / 2;
    firstLineY1 = firstLineY0;

    secondLineX0 = firstLineX1;
    secondLineY0 = firstLineY1;
    secondLineX1 = secondLineX0;
    secondLineY1 = toY + toHeight / 2;

    thirdLineX0 = secondLineX1;
    thirdLineY0 = secondLineY1;
    thirdLineX1 = toX;
    thirdLineY1 = toY + toHeight / 2;
  }

  //
  //
  //
  //   ____________
  //  |           |                          _____________
  //  |     to    |_____________            |            |
  //  |           |            |____________|   from     |
  //  |___________|                         |            |
  //                                        |____________|
  //
  if (
    fromY + fromHeight > toY &&
    fromY - fromHeight / 2 < toY + toHeight &&
    fromX > toX + toWidth
  ) {
    firstLineX0 = fromX;
    firstLineY0 = fromY + fromHeight / 2;
    firstLineX1 = (fromX + fromWidth + toX) / 2;
    firstLineY1 = firstLineY0;

    secondLineX0 = firstLineX1;
    secondLineY0 = firstLineY1;
    secondLineX1 = secondLineX0;
    secondLineY1 = toY + toHeight / 2;

    thirdLineX0 = secondLineX1;
    thirdLineY0 = secondLineY1;
    thirdLineX1 = toX + toWidth;
    thirdLineY1 = toY + toHeight / 2;
  }

  //
  //                           ____________
  //                          |           |
  //                          |    to     |
  //                          |           |
  //                          |___________|
  //                               |
  //          _____________________|
  //         |
  //   ______|_____
  //  |           |
  //  |   from    |
  //  |           |
  //  |___________|
  //
  //
  if (fromY > toY + toHeight) {
    firstLineX0 = fromX + fromWidth / 2;
    firstLineY0 = fromY;
    firstLineX1 = firstLineX0;
    firstLineY1 = (fromY + toY + toHeight) / 2;

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
  if (fromX + fromWidth <= toX) {
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
  if (fromX >= toX + toWidth) {
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
    fromX + fromWidth > toX &&
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
    fromX < toX + toWidth &&
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
    fromX + fromWidth > toX &&
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
    fromX < toX + toWidth &&
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
