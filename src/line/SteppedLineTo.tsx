import React from 'react';
import { detect, LineToProps } from './LineTo';
import SteppedLine from './SteppedLine';

const SteppedLineTo = (props: LineToProps) => (
  <SteppedLine {...detect(props)} {...props} />
);

export default SteppedLineTo;
