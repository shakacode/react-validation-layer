/* @flow */

import * as utils from '../../../../src/modules/utils';

describe('utils.isFunction()', () => {
  it('returns `true` for `function`', () => {
    function imFunction() {}
    const isFunction = utils.isFunction(imFunction);
    expect(isFunction).toBe(true);
  });

  it('returns `true` for arrow function', () => {
    const isFunction = utils.isFunction(v => v);
    expect(isFunction).toBe(true);
  });

  it('returns `false` for `{}`', () => {
    const isFunction = utils.isFunction({});
    expect(isFunction).toBe(false);
  });

  it('returns `false` for `new Object()`', () => {
    const isFunction = utils.isFunction(new Object()); // eslint-disable-line no-new-object
    expect(isFunction).toBe(false);
  });

  it('returns `false` for `[]`', () => {
    const isFunction = utils.isFunction([]);
    expect(isFunction).toBe(false);
  });

  it('returns `false` for `new Array()`', () => {
    // $FlowIgnoreMe
    const isFunction = utils.isFunction(new Array()); // eslint-disable-line no-array-constructor, max-len
    expect(isFunction).toBe(false);
  });

  it('returns `false` for `true`', () => {
    const isFunction = utils.isFunction(true);
    expect(isFunction).toBe(false);
  });

  it('returns `false` for `false`', () => {
    const isFunction = utils.isFunction(false);
    expect(isFunction).toBe(false);
  });

  it('returns `false` for `null`', () => {
    const isFunction = utils.isFunction(null);
    expect(isFunction).toBe(false);
  });

  it('returns `false` for `undefined`', () => {
    const isFunction = utils.isFunction(undefined);
    expect(isFunction).toBe(false);
  });

  it('returns `false` for `1`', () => {
    const isFunction = utils.isFunction(1);
    expect(isFunction).toBe(false);
  });

  it('returns `false` for `\'string\'`', () => {
    const isFunction = utils.isFunction('string');
    expect(isFunction).toBe(false);
  });

  it('returns `false` for `new Date()`', () => {
    const isFunction = utils.isFunction(new Date());
    expect(isFunction).toBe(false);
  });
});
