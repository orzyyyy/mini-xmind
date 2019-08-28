# mini-xmind

![CircleCI](https://img.shields.io/circleci/project/github/orzyyyy/mini-xmind/master.svg)
[![codecov](https://codecov.io/gh/orzyyyy/mini-xmind/branch/master/graph/badge.svg)](https://codecov.io/gh/orzyyyy/mini-xmind)

what you see in gif is the all what the repo do, just as title, a web tool for mini mind-mapping.

online demo: https://orzyyyy.github.io/mini-xmind

## Usage

```javascript
import { Canvas, Toolbar } from 'mini-xmind';

const data = {
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

export default () => (
  <div className="Demo">
    <Toolbar />
    <Canvas className="canvas-wrapper" data={data} />
  </div>
);
```

## Development

```bash
git clone https://github.com/orzyyyy/mini-xmind.git

cd mini-xmind

npm install

npm start

http://localhost:9099
```

## Example

http://localhost:9099/

## Test Case

```
npm test
```

## Coverage

```
npm run coverage
```

## API

### Toolbar props

There is no prop for now, just render

### Canvas props

| Property    | Description                                         | Type                                                                                         | Default |
| ----------- | --------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------- |
| data        | What you want to paint in canvas                    | object, { BlockGroup: {}, TagGroup: {}, LineGroup: {}, CanvasPosition: {} }                  | {}      |
| orientation | The direction of Line startting                     | enum, ['h', 'v', 'horizonal', 'vertical'], h == horizonal && v = vertical                    | h       |
| onChange    | Return all data when dragging or typing in TagGroup | (dataCollector: { BlockGroup: {}, TagGroup: {}, LineGroup: {}, CanvasPosition: {} }) => void | -       |
