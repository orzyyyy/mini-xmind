import React from 'react';
import { mount } from 'enzyme';
import MockDate from 'mockdate';
import BlockGroup from '../BlockGroup';
import { setClickList, setLineMapping, setTargetDom, getTargetDom } from '../../canvas/nino-zone';

const defaultCheckBlockClickList1 = {
  'block-73377': {
    x: 361,
    y: 536,
  },
  'block-624018': {
    x: 359,
    y: 180,
  },
};
const defaultLineData = {
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
};

describe('BlockGroup', () => {
  it('when lineData is undefined, onChange should not be called', () => {
    const onChange = jest.fn();
    const onContextMenu = jest.fn();
    const onWheel = jest.fn();
    mount(
      <BlockGroup
        data={{
          'block-442566': {
            x: 571,
            y: 320,
          },
          'block-442567': {
            x: 771,
            y: 520,
          },
        }}
        lineData={defaultLineData}
        onChange={onChange}
        onContextMenu={onContextMenu}
        onWheel={onWheel}
      />,
    );
    expect(onChange).not.toBeCalled();
  });

  it('when dragging, onChange should be called', () => {
    const onChange = jest.fn();
    const onContextMenu = jest.fn();
    const onWheel = jest.fn();
    const wrapper: any = mount(
      <BlockGroup
        data={{
          'block-442566': {
            x: 571,
            y: 320,
          },
        }}
        lineData={defaultLineData}
        onChange={onChange}
        onContextMenu={onContextMenu}
        onWheel={onWheel}
      />,
    );
    wrapper.find('Draggable').props().onDrag({ x: 0, y: 0 }, 'block-442566');
    expect(onChange).toBeCalled();
  });

  it('handleBlockClick', () => {
    MockDate.set(new Date('2019-04-09T00:00:00'));
    const onChange = jest.fn();
    const onContextMenu = jest.fn();
    const onWheel = jest.fn();
    const wrapper: any = mount(
      <BlockGroup
        data={defaultCheckBlockClickList1}
        lineData={defaultLineData}
        onChange={onChange}
        onContextMenu={onContextMenu}
        onWheel={onWheel}
      />,
    );
    setClickList({}, true);
    setLineMapping({}, true);
    setTargetDom({ 'block-73377': {}, 'block-624018': {} });
    wrapper.find('.block-group').at(1).props().onClick('block-73377');
    expect(onChange).not.toHaveBeenCalled();
    wrapper.find('.block-group').at(1).props().onClick('block-624018');
    expect(getTargetDom()).toEqual({
      'block-442566': {
        bottom: 0,
        height: 0,
        left: 0,
        right: 0,
        top: 0,
        width: 0,
        x: 0,
        y: 0,
      },
      'block-442567': {
        bottom: 0,
        height: 0,
        left: 0,
        right: 0,
        top: 0,
        width: 0,
        x: 0,
        y: 0,
      },
      'block-624018': {},
      'block-73377': {},
    });
    setLineMapping({ test1: { fromKey: 'block-73377', toKey: 'block-624018' } }, true);
    setTargetDom({ 'block-73377': {}, 'block-624018': {} });
    setClickList({ 'block-73377': {}, 'block-624018': {} }, true);
    expect(wrapper.find('.block-group').at(1).props().onClick('block-73377')).toBe(undefined);
    MockDate.reset();
  });

  it('handleDragStart', () => {
    const stopPropagation = jest.fn();
    const preventDefault = jest.fn();
    const onChange = jest.fn();
    const onContextMenu = jest.fn();
    const onWheel = jest.fn();
    const wrapper: any = mount(
      <BlockGroup
        data={{
          'block-442566': {
            x: 571,
            y: 320,
          },
        }}
        lineData={defaultLineData}
        onChange={onChange}
        onContextMenu={onContextMenu}
        onWheel={onWheel}
      />,
    );
    wrapper.find('Draggable').first().props().onStart({ stopPropagation, preventDefault });
    expect(preventDefault).toHaveBeenCalled();
    expect(stopPropagation).toHaveBeenCalled();
  });

  it('onContextMenu', () => {
    const onContextMenu = jest.fn();
    const onChange = jest.fn();
    const onWheel = jest.fn();
    const wrapper: any = mount(
      <BlockGroup
        data={{
          'block-442566': {
            x: 571,
            y: 320,
          },
        }}
        lineData={defaultLineData}
        onContextMenu={onContextMenu}
        onChange={onChange}
        onWheel={onWheel}
      />,
    );
    wrapper.find('.block-group').at(1).props().onContextMenu();
    expect(onContextMenu).toHaveBeenCalled();
  });
});
