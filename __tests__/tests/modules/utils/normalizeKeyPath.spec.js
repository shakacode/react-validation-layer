/* @flow */

import * as utils from '../../../../src/modules/utils';

describe('utils.normalizeKeyPath()', () => {
  it('returns array with one string for string', () => {
    const keyPath = 'attr';
    const normalizedKeyPath = utils.normalizeKeyPath(keyPath);

    expect(normalizedKeyPath).toEqual(['attr']);
  });

  it('returns array of strings for array of strings', () => {
    const keyPath = ['scope', 'attr'];
    const normalizedKeyPath = utils.normalizeKeyPath(keyPath);

    expect(normalizedKeyPath).toBe(keyPath);
  });
});
