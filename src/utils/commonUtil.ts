import { LineItem } from '../tools/LineGroup';

export function noop() {}

export const convertDomRect2Object = (item: DOMRect | ClientRect): LineItem => {
  let x;
  let y;
  x = 'x' in item ? item.x : item.left;
  y = 'y' in item ? item.y : item.top;
  return {
    top: item.top,
    right: item.right,
    bottom: item.bottom,
    left: item.left,
    width: item.width,
    height: item.height,
    x,
    y,
  };
};
