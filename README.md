# mini-xmind

![CircleCI](https://img.shields.io/circleci/project/github/orzyyyy/mini-xmind/master.svg)
[![codecov](https://codecov.io/gh/orzyyyy/mini-xmind/branch/master/graph/badge.svg)](https://codecov.io/gh/orzyyyy/mini-xmind)

A web tool for mini mind-mapping.

Online demo: https://orzyyyy.github.io/mini-xmind

## Usage

```javascript
import React, { useState, useEffect } from 'react';
import { Canvas, Toolbar } from 'mini-xmind';

const dataSource = {
  CanvasPosition: { x: -67, y: 230 },
  BlockGroup: {
    'block-623187': {
      x: 158,
      y: 256,
    },
    'block-624018': {
      x: 367,
      y: 368,
    },
    'block-73377': {
      x: 253,
      y: 525,
    },
  },
  TagGroup: {
    'tag-626505': {
      x: 167,
      y: 284,
      style: { width: 100, height: 32 },
      editable: false,
      input: 'test',
    },
    'tag-629962': {
      x: 405,
      y: 398,
      style: { width: 100, height: 32 },
      editable: false,
      input: 'test2',
    },
    'tag-80986': {
      x: 286,
      y: 555,
      style: { width: 100, height: 32 },
      editable: false,
      input: 'test3',
    },
  },
  LineGroup: {
    'line-77619': { fromKey: 'block-73377', toKey: 'block-623187' },
    'line-592694': { fromKey: 'block-623187', toKey: 'block-624018' },
  },
};

export default () => {
  const [data, setData] = useState({});

  useEffect(() => {
    setData(dataSource);
  }, []);

  const onChange = newData => {
    setData(newData);
  };

  return (
    <>
      <Toolbar />
      <Canvas className="canvas-wrapper" data={data} onChange={onChange} />
    </>
  );
};
```

## Development

```bash
$ git clone https://github.com/orzyyyy/mini-xmind.git
$ cd mini-xmind
$ npm install
$ npm start
```

Open your browser and visit <http://localhost:9099>

## Test Case

```
npm test
```

## API

### Toolbar props

There is no prop for now, just render

### Canvas props

| Property    | Description                                         | Type                                                                                                                                               | Default   |
| ----------- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| data        | what you want to paint in canvas                    | [DataSource](https://github.com/orzyyyy/mini-xmind/blob/0b83c704edf98fac54dc5117f120565b28244877/src/canvas/core.tsx#L23)                          | {}        |
| orientation | the direction of Line startting                     | enum, ['horizonal', 'vertical']                                                                                                                    | horizonal |
| onChange    | return all data when dragging or typing in TagGroup | (dataCollector: [DataSource](https://github.com/orzyyyy/mini-xmind/blob/0b83c704edf98fac54dc5117f120565b28244877/src/canvas/core.tsx#L23)) => void | -         |
