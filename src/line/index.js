// fork from https://github.com/kdeloach/react-lineto
// because I must refactor for draggable

// rename Line to core because circleci is case-sensitive
import Line from './core';
import LineTo from './LineTo';
import SteppedLineTo from './SteppedLineTo';

export default LineTo;
export { SteppedLineTo, Line };
