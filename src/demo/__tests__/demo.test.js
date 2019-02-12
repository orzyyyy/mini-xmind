import React from 'react';
import { mount } from 'enzyme';
import Demo from '..';
import Listener from '../../utils/GlobalListener';
import 'nino-cli/scripts/setup';

describe('demo', () => {
  beforeEach(() => {
    window.DataCollector = new Listener();
  });

  afterEach(() => {
    window.DataCollector = null;
  });

  it('render correctly', () => {
    const wrapper = mount(<Demo />);
    expect(wrapper).toMatchSnapshot();
  });

  it('when button is clicked, it should return layout info', () => {
    const wrapper = mount(<Demo />);
    const data = wrapper.instance().outputData();
    const mapping = JSON.parse(
      '{"CanvasPosition":{"x":-67,"y":230},"BlockGroup":{"block-623187":{"x":158,"y":256,"style":{"width":100,"height":80,"background":"#F96","borderRadius":"10px","border":"1px solid #aaa"}},"block-624018":{"x":367,"y":368,"style":{"width":100,"height":80,"background":"#F96","borderRadius":"10px","border":"1px solid #aaa"}},"block-73377":{"x":253,"y":525,"style":{"width":100,"height":80,"background":"#F96","borderRadius":"10px","border":"1px solid #aaa"}}},"TagGroup":{"tag-626505":{"x":167,"y":284,"style":{"width":100,"height":32},"editable":false,"input":"test"},"tag-629962":{"x":405,"y":398,"style":{"width":100,"height":32},"editable":false,"input":"test2"},"tag-80986":{"x":286,"y":555,"style":{"width":100,"height":32},"editable":false,"input":"test3"}},"LineGroup":{"line-77619":{"fromKey":"block-73377","toKey":"block-623187"},"line-592694":{"fromKey":"block-623187","toKey":"block-624018"}}}',
    );
    expect(mapping).toEqual(data);
  });

  it('when state changed, Line should render correctly', () => {
    const wrapper = mount(<Demo />);
    const data = wrapper.instance().outputData();
    wrapper.setState({ data });
    wrapper.update();
    expect(wrapper.find('.stepped-line-to').length).toBe(2);
  });
});
