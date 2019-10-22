import React, { useState, useEffect } from 'react';
import Canvas, { DataSource } from '../canvas/core';
import Toolbar from '../tools/Toolbar';
import './css/demo.css';

export const mapping = {
  block: {},
  line: {
    'line-446586': {
      fromKey: 'tag-416176',
      toKey: 'tag-443720',
      from: {
        top: 369,
        right: 287.578125,
        bottom: 390,
        left: 265,
        width: 22.578125,
        height: 21,
        x: 265,
        y: 369,
      },
      to: {
        top: 502,
        right: 508.359375,
        bottom: 523,
        left: 478,
        width: 30.359375,
        height: 21,
        x: 478,
        y: 502,
      },
    },
    'line-451979': {
      fromKey: 'tag-439992',
      toKey: 'tag-416176',
      from: {
        top: 267,
        right: 143.359375,
        bottom: 288,
        left: 113,
        width: 30.359375,
        height: 21,
        x: 113,
        y: 267,
      },
      to: {
        top: 369,
        right: 287.578125,
        bottom: 390,
        left: 265,
        width: 22.578125,
        height: 21,
        x: 265,
        y: 369,
      },
    },
    'line-479893': {
      fromKey: 'tag-476280',
      toKey: 'tag-416176',
      from: {
        top: 240,
        right: 494.359375,
        bottom: 261,
        left: 464,
        width: 30.359375,
        height: 21,
        x: 464,
        y: 240,
      },
      to: {
        top: 369,
        right: 287.578125,
        bottom: 390,
        left: 265,
        width: 22.578125,
        height: 21,
        x: 265,
        y: 369,
      },
    },
    'line-493906': {
      fromKey: 'tag-491320',
      toKey: 'tag-443720',
      from: {
        top: 591,
        right: 600.359375,
        bottom: 612,
        left: 570,
        width: 30.359375,
        height: 21,
        x: 570,
        y: 591,
      },
      to: {
        top: 502,
        right: 508.359375,
        bottom: 523,
        left: 478,
        width: 30.359375,
        height: 21,
        x: 478,
        y: 502,
      },
    },
    'line-761026': {
      from: {
        bottom: 512,
        height: 21,
        left: 670,
        right: 700.359375,
        top: 491,
        width: 30.359375,
        x: 670,
        y: 491,
      },
      fromKey: 'tag-491322',
      to: {
        bottom: 612,
        height: 21,
        left: 570,
        right: 600.359375,
        top: 591,
        width: 30.359375,
        x: 570,
        y: 591,
      },
      toKey: 'tag-491320',
    },
    'line-762482': {
      from: {
        bottom: 712,
        height: 21,
        left: 670,
        right: 700.359375,
        top: 691,
        width: 30.359375,
        x: 670,
        y: 691,
      },
      fromKey: 'tag-491321',
      to: {
        bottom: 612,
        height: 21,
        left: 570,
        right: 600.359375,
        top: 591,
        width: 30.359375,
        x: 570,
        y: 591,
      },
      toKey: 'tag-491320',
    },
    'line-758626': {
      from: {
        bottom: 412,
        height: 21,
        left: 670,
        right: 700.359375,
        top: 391,
        width: 30.359375,
        x: 670,
        y: 391,
      },
      fromKey: 'tag-491323',
      to: {
        bottom: 261,
        height: 21,
        left: 464,
        right: 494.359375,
        top: 240,
        width: 30.359375,
        x: 464,
        y: 240,
      },
      toKey: 'tag-476280',
    },
  },
  tag: {
    'tag-416176': {
      x: 186,
      y: 469,
      editable: false,
      input: 'test',
    },
    'tag-439992': {
      x: 34,
      y: 367,
      editable: false,
      input: 'test2',
    },
    'tag-443720': {
      x: 399,
      y: 602,
      editable: false,
      input: 'test3',
    },
    'tag-476280': {
      x: 385,
      y: 340,
      editable: false,
      input: 'test4',
      children: ['tag-491323'],
    },
    'tag-491320': {
      x: 491,
      y: 691,
      editable: false,
      input: 'test5',
      children: ['tag-491321', 'tag-491322'],
    },
    'tag-491321': {
      x: 591,
      y: 791,
      editable: false,
      input: 'test6',
    },
    'tag-491322': {
      x: 591,
      y: 591,
      editable: false,
      input: 'test7',
    },
    'tag-491323': {
      x: 591,
      y: 491,
      editable: false,
      input: 'test8',
    },
  },
  position: { root: { x: 79, y: -100 } },
};

const debounce = (fun: any, delay: number) => (args: any) => {
  clearTimeout(fun.id);
  fun.id = setTimeout(function() {
    fun.call(this, args);
  }, delay);
};

function useDebounce(data: DataSource) {
  // eslint-disable-next-line
  console.log(data);
}

const Demo = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    setData(mapping);
  }, []);

  const handleChange = (data: DataSource) => {
    debounce(useDebounce, 100)(data);
    setData(data);
  };

  return (
    <div className="Demo">
      <Toolbar />
      <Canvas className="canvas-wrapper" data={data} onChange={handleChange} />
    </div>
  );
};

export default Demo;
