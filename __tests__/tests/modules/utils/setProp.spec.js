/* @flow */

import { Record } from 'immutable';

import * as utils from '../../../../src/modules/utils';

describe('utils.setProp()', () => {
  it('sets prop on flat vanilla JS Object w/o mutation', () => {
    const data = { attr: 1 };
    const keyPath = 'attr';
    const nextValue = 2;
    const nextData = utils.setProp(data, keyPath, nextValue);

    expect(data.attr).toBe(1);
    expect(nextData.attr).toBe(2);
    expect(data).not.toBe(nextData);
  });


  it('sets prop on nested vanilla JS Object w/o mutation', () => {
    const data = { nested: { attr: 1 } };
    const keyPath = ['nested', 'attr'];
    const nextValue = 2;
    const nextData = utils.setProp(data, keyPath, nextValue);

    expect(data.nested.attr).toBe(1);
    expect(nextData.nested.attr).toBe(2);
    expect(data).not.toBe(nextData);
  });


  it('sets prop on Immutable Record', () => {
    const Data = Record({ attr: null });
    const data = new Data({ attr: 1 });
    const keyPath = 'attr';
    const nextValue = 2;
    const nextData = utils.setProp(data, keyPath, nextValue);

    expect(data.attr).toBe(1);
    expect(nextData.attr).toBe(2);
  });
});
