/* eslint-disable max-len */

import * as utils from '../src/utils';

describe('utils.isPlainObject()', () => {
  it('says `{}` is plain object', () => {
    const isPlainObject = utils.isPlainObject({});
    expect(isPlainObject).toBe(true);
  });

  it('says `new Object()` is plain object', () => {
    // eslint-disable-next-line no-new-object
    const isPlainObject = utils.isPlainObject(new Object());
    expect(isPlainObject).toBe(true);
  });

  it('says `[]` is not plain object', () => {
    const isPlainObject = utils.isPlainObject([]);
    expect(isPlainObject).toBe(false);
  });

  it('says `function` is not plain object', () => {
    function imNotPlainObject() {}
    const isPlainObject = utils.isPlainObject(imNotPlainObject);
    expect(isPlainObject).toBe(false);
  });

  it('says `v => v` is not plain object', () => {
    const isPlainObject = utils.isPlainObject(v => v);
    expect(isPlainObject).toBe(false);
  });

  it('says `true` is not plain object', () => {
    const isPlainObject = utils.isPlainObject(true);
    expect(isPlainObject).toBe(false);
  });

  it('says `false` is not plain object', () => {
    const isPlainObject = utils.isPlainObject(false);
    expect(isPlainObject).toBe(false);
  });

  it('says `null` is not plain object', () => {
    const isPlainObject = utils.isPlainObject(null);
    expect(isPlainObject).toBe(false);
  });

  it('says `undefined` is not plain object', () => {
    const isPlainObject = utils.isPlainObject(undefined);
    expect(isPlainObject).toBe(false);
  });

  it('says `1` is not plain object', () => {
    const isPlainObject = utils.isPlainObject(1);
    expect(isPlainObject).toBe(false);
  });

  it('says `\'string\'` is not plain object', () => {
    const isPlainObject = utils.isPlainObject('string');
    expect(isPlainObject).toBe(false);
  });

  it('says `new Array()` is not plain object', () => {
    // eslint-disable-next-line no-array-constructor
    const isPlainObject = utils.isPlainObject(new Array());
    expect(isPlainObject).toBe(false);
  });

  it('says `new Date()` is not plain object', () => {
    const isPlainObject = utils.isPlainObject(new Date());
    expect(isPlainObject).toBe(false);
  });
});
