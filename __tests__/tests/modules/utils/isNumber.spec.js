/* @flow */

import * as utils from '../../../../src/modules/utils';

describe('utils.isNumber()', () => {
  it('returns `true` for `1`', () => {
    const isNumber = utils.isNumber(1);
    expect(isNumber).toBe(true);
  });

  it('returns `false` for `{}`', () => {
    const isNumber = utils.isNumber({});
    expect(isNumber).toBe(false);
  });

  it('returns `false` for `new Object()`', () => {
    const isNumber = utils.isNumber(new Object()); // eslint-disable-line no-new-object
    expect(isNumber).toBe(false);
  });

  it('returns `false` for `[]`', () => {
    const isNumber = utils.isNumber([]);
    expect(isNumber).toBe(false);
  });

  it('returns `false` for `new Array()`', () => {
    // $FlowIgnoreMe
    const isNumber = utils.isNumber(new Array()); // eslint-disable-line no-array-constructor, max-len
    expect(isNumber).toBe(false);
  });

  it('returns `false` for `function`', () => {
    function imNotPlainObject() {}
    const isNumber = utils.isNumber(imNotPlainObject);
    expect(isNumber).toBe(false);
  });

  it('returns `false` for arrow function', () => {
    const isNumber = utils.isNumber(v => v);
    expect(isNumber).toBe(false);
  });

  it('returns `false` for `true`', () => {
    const isNumber = utils.isNumber(true);
    expect(isNumber).toBe(false);
  });

  it('returns `false` for `false`', () => {
    const isNumber = utils.isNumber(false);
    expect(isNumber).toBe(false);
  });

  it('returns `false` for `null`', () => {
    const isNumber = utils.isNumber(null);
    expect(isNumber).toBe(false);
  });

  it('returns `false` for `undefined`', () => {
    const isNumber = utils.isNumber(undefined);
    expect(isNumber).toBe(false);
  });

  it("returns `false` for `'string'`", () => {
    const isNumber = utils.isNumber('string');
    expect(isNumber).toBe(false);
  });

  it('returns `false` for `new Date()`', () => {
    const isNumber = utils.isNumber(new Date());
    expect(isNumber).toBe(false);
  });
});
