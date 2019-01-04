import { getPlacement, getCenterByTwoPoints } from '../LineUtil';

describe('LineUtil', () => {
  it('getPlacement works correctly', () => {
    const rectangle = {
      topLeft: { x: 200, y: 200 },
      topRight: { x: 300, y: 200 },
      bottomLeft: { x: 200, y: 280 },
      bottomRight: { x: 300, y: 280 },
    };
    const target = getCenterByTwoPoints(
      rectangle.topRight,
      rectangle.bottomLeft,
    );
    const width = 100;
    const height = 80;

    const firstQuadrantTop = { x: 300, y: 300 };
    const firstQuadrantBottom = { x: 300, y: 100 };
    const secondQuadrantTop = { x: 200, y: 300 };
    const secondQuadrantBottom = { x: 200, y: 100 };
    const thirdQuadrantTop = { x: 200, y: 420 };
    const thirdQuadrantBottom = { x: 200, y: 140 };
    const fourthQuadrantTop = { x: 300, y: 420 };
    const fourthQuadrantBottom = { x: 300, y: 140 };

    const firstQuadrantTopInstance = getPlacement(
      target,
      firstQuadrantTop,
      width,
      height,
    );
    expect(firstQuadrantTopInstance.fromAnchor).toBe('top');
    expect(firstQuadrantTopInstance.toAnchor).toBe('bottom');

    const firstQuadrantBottomInstance = getPlacement(
      target,
      firstQuadrantBottom,
      width,
      height,
    );
    expect(firstQuadrantBottomInstance.fromAnchor).toBe('top');
    expect(firstQuadrantBottomInstance.toAnchor).toBe('left');

    const secondQuadrantTopInstance = getPlacement(
      target,
      secondQuadrantTop,
      width,
      height,
    );
    expect(secondQuadrantTopInstance.fromAnchor).toBe('top');
    expect(secondQuadrantTopInstance.toAnchor).toBe('bottom');

    const secondQuadrantBottomInstance = getPlacement(
      target,
      secondQuadrantBottom,
      width,
      height,
    );
    expect(secondQuadrantBottomInstance.fromAnchor).toBe('top');
    expect(secondQuadrantBottomInstance.toAnchor).toBe('right');

    const thirdQuadrantTopInstance = getPlacement(
      target,
      thirdQuadrantTop,
      width,
      height,
    );
    expect(thirdQuadrantTopInstance.fromAnchor).toBe('bottom');
    expect(thirdQuadrantTopInstance.toAnchor).toBe('right');

    const thirdQuadrantBottomInstance = getPlacement(
      target,
      thirdQuadrantBottom,
      width,
      height,
    );
    expect(thirdQuadrantBottomInstance.fromAnchor).toBe('bottom');
    expect(thirdQuadrantBottomInstance.toAnchor).toBe('top');

    const fourthQuadrantTopInstance = getPlacement(
      target,
      fourthQuadrantTop,
      width,
      height,
    );
    expect(fourthQuadrantTopInstance.fromAnchor).toBe('bottom');
    expect(fourthQuadrantTopInstance.toAnchor).toBe('left');

    const fourthQuadrantBottomInstance = getPlacement(
      target,
      fourthQuadrantBottom,
      width,
      height,
    );
    expect(fourthQuadrantBottomInstance.fromAnchor).toBe('bottom');
    expect(fourthQuadrantBottomInstance.toAnchor).toBe('right');
  });
});
