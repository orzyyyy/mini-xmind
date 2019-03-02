import { isSameCoordinate } from '../commonUtil';

describe('commonUtil', () => {
  it('when currentKey is null, return', () => {
    expect(isSameCoordinate({}, {}, null)).toBe(false);
    expect(
      isSameCoordinate(
        {
          data: {
            block: { x: 10, y: 10 },
          },
        },
        {
          data: {
            block: { x: 10, y: 10 },
          },
        },
        'block',
      ),
    ).toBe(false);
    expect(
      isSameCoordinate(
        {
          data: {
            block: { x: 11, y: 10 },
          },
        },
        {
          data: {
            block: { x: 10, y: 10 },
          },
        },
        'block',
      ),
    ).toBe(true);
  });
});
