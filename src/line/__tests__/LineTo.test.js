import { parseAnchor, parseAnchorText, parseAnchorPercent } from '../LineTo';

describe('LineTo', () => {
  it('parseAnchor should work', () => {
    expect(parseAnchor('1 2')).toEqual({ x: 0.01, y: 0.02 });
    expect(parseAnchor('1 2 3')).toBe('LinkTo anchor format is "<x> <y>"');
  });

  it('parseAnchorText should work', () => {
    expect(parseAnchorText('top')).toEqual({ y: 0 });
    expect(parseAnchorText('left')).toEqual({ x: 0 });
    expect(parseAnchorText('middle')).toEqual({ y: 0.5 });
    expect(parseAnchorText('center')).toEqual({ x: 0.5 });
    expect(parseAnchorText('bottom')).toEqual({ y: 1 });
    expect(parseAnchorText('right')).toEqual({ x: 1 });
    expect(parseAnchorText('')).toEqual(null);
  });
  it('parseAnchorPercent should work', () => {
    expect(parseAnchorPercent('1')).toEqual(0.01);
    expect(parseAnchorPercent('test')).toBe(
      'LinkTo could not parse percent value: test',
    );
  });
});
