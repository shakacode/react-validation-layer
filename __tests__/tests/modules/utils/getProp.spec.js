/* @flow */

import { Record } from 'immutable';

import * as utils from '../../../../src/modules/utils';

describe('utils.getProp()', () => {
  it('gets prop of flat vanilla JS Object', () => {
    const data = { attr: 1 };
    const keyPath = 'attr';
    const value = utils.getProp(data, keyPath);

    expect(value).toBe(1);
  });

  it('gets prop of nested vanilla JS Object', () => {
    const data = { nested: { attr: 1 } };
    const keyPath = ['nested', 'attr'];
    const value = utils.getProp(data, keyPath);

    expect(value).toBe(1);
  });

  it('gets prop of Immutable Record', () => {
    const Data = Record({ attr: null });
    const data = new Data({ attr: 1 });
    const keyPath = 'attr';
    const value = utils.getProp(data, keyPath);

    expect(value).toBe(1);
  });
});
