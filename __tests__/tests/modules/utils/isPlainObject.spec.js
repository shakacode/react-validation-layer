/* @flow */

import * as utils from '../../../../src/modules/utils';

describe('utils.isPlainObject()', () => {
  it('returns `true` for `{}`', () => {
    const isPlainObject = utils.isPlainObject({});
    expect(isPlainObject).toBe(true);
  });

  it('returns `true` for `new Object()`', () => {
    const isPlainObject = utils.isPlainObject(new Object()); // eslint-disable-line no-new-object
    expect(isPlainObject).toBe(true);
  });

  it('returns `false` for `[]`', () => {
    const isPlainObject = utils.isPlainObject([]);
    expect(isPlainObject).toBe(false);
  });

  it('returns `false` for `new Array()`', () => {
    // $FlowIgnoreMe
    const isPlainObject = utils.isPlainObject(new Array()); // eslint-disable-line no-array-constructor, max-len
    expect(isPlainObject).toBe(false);
  });

  it('returns `false` for `function`', () => {
    function imNotPlainObject() {}
    const isPlainObject = utils.isPlainObject(imNotPlainObject);
    expect(isPlainObject).toBe(false);
  });

  it('returns `false` for arrow function', () => {
    const isPlainObject = utils.isPlainObject(v => v);
    expect(isPlainObject).toBe(false);
  });

  it('returns `false` for `true`', () => {
    const isPlainObject = utils.isPlainObject(true);
    expect(isPlainObject).toBe(false);
  });

  it('returns `false` for `false`', () => {
    const isPlainObject = utils.isPlainObject(false);
    expect(isPlainObject).toBe(false);
  });

  it('returns `false` for `null`', () => {
    const isPlainObject = utils.isPlainObject(null);
    expect(isPlainObject).toBe(false);
  });

  it('returns `false` for `undefined`', () => {
    const isPlainObject = utils.isPlainObject(undefined);
    expect(isPlainObject).toBe(false);
  });

  it('returns `false` for `1`', () => {
    const isPlainObject = utils.isPlainObject(1);
    expect(isPlainObject).toBe(false);
  });

  it("returns `false` for `'string'`", () => {
    const isPlainObject = utils.isPlainObject('string');
    expect(isPlainObject).toBe(false);
  });

  it('returns `false` for `new Date()`', () => {
    const isPlainObject = utils.isPlainObject(new Date());
    expect(isPlainObject).toBe(false);
  });
});
