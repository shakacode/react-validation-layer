/* @flow */

import * as utils from '../../../../src/modules/utils';

describe('utils.isString()', () => {
  it('returns `true` for `\'string\'`', () => {
    const isString = utils.isString('string');
    expect(isString).toBe(true);
  });

  it('returns `false` for `{}`', () => {
    const isString = utils.isString({});
    expect(isString).toBe(false);
  });

  it('returns `false` for `new Object()`', () => {
    const isString = utils.isString(new Object()); // eslint-disable-line no-new-object
    expect(isString).toBe(false);
  });

  it('returns `false` for `[]`', () => {
    const isString = utils.isString([]);
    expect(isString).toBe(false);
  });

  it('returns `false` for `new Array()`', () => {
    // $FlowIgnoreMe
    const isString = utils.isString(new Array()); // eslint-disable-line no-array-constructor, max-len
    expect(isString).toBe(false);
  });

  it('returns `false` for `function`', () => {
    function imNotPlainObject() {}
    const isString = utils.isString(imNotPlainObject);
    expect(isString).toBe(false);
  });

  it('returns `false` for arrow function', () => {
    const isString = utils.isString(v => v);
    expect(isString).toBe(false);
  });

  it('returns `false` for `true`', () => {
    const isString = utils.isString(true);
    expect(isString).toBe(false);
  });

  it('returns `false` for `false`', () => {
    const isString = utils.isString(false);
    expect(isString).toBe(false);
  });

  it('returns `false` for `null`', () => {
    const isString = utils.isString(null);
    expect(isString).toBe(false);
  });

  it('returns `false` for `undefined`', () => {
    const isString = utils.isString(undefined);
    expect(isString).toBe(false);
  });

  it('returns `false` for `1`', () => {
    const isString = utils.isString(1);
    expect(isString).toBe(false);
  });

  it('returns `false` for `new Date()`', () => {
    const isString = utils.isString(new Date());
    expect(isString).toBe(false);
  });
});
