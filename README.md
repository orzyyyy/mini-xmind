# mini-xmind

![CircleCI](https://img.shields.io/circleci/project/github/breathing-is-fun/mini-xmind/master.svg)
[![Greenkeeper badge](https://badges.greenkeeper.io/breathing-is-fun/mini-xmind.svg)](https://greenkeeper.io/)


![img](./docs/assets/demo.gif)

what you see in gif is the all what the repo do, just as title, a web tool for mini mind-mapping

# usage

```bash
npm install mini-xmind --save-dev
```

```javascript
import { Canvas, Toolbar } from 'mini-xmind';

export class Demo extends React.Component {
  render = () => {
    const data = {
      BlockGroup: {
        'block-623187': {
          x: 158,
          y: 256,
          style: {
            width: 100,
            height: 80,
            background: '#F96',
            borderRadius: '10px',
            border: '1px solid #aaa',
          },
        },
        'block-624018': {
          x: 367,
          y: 368,
          style: {
            width: 100,
            height: 80,
            background: '#F96',
            borderRadius: '10px',
            border: '1px solid #aaa',
          },
        },
        'block-73377': {
          x: 253,
          y: 525,
          style: {
            width: 100,
            height: 80,
            background: '#F96',
            borderRadius: '10px',
            border: '1px solid #aaa',
          },
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

    return (
      <div className="Demo">
        <Toolbar />
        <Canvas className="canvas-wrapper" data={data} />
      </div>
    );
  };
}
```

# develop

```bash
git clone https://github.com/breathing-is-fun/mini-xmind.git

cd mini-xmind

npm install

npm start

http://localhost:9099
```

# api

## Toolbar

There is no prop for it, just render it...

## Canvas

| Property    | Description                      | Type                                                                      | Default |
| ----------- | -------------------------------- | ------------------------------------------------------------------------- | ------- |
| data        | What you want to paint in canvas | object, { BlockGroup: {}, TagGroup: {}, LineGroup: {} }                   | {}      |
| orientation | The direction of Line startting  | enum, ['h', 'v', 'horizonal', 'vertical'], h == horizonal && v = vertical | h       |
