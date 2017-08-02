/* @flow */

import * as utils from '../../../../src/modules/utils';

describe('utils.normalizeValueForDom()', () => {
  it('returns value if value is string', () => {
    const value = 'value';
    const normalizedValue = utils.normalizeValueForDom(value);

    expect(normalizedValue).toBe('value');
  });

  it('returns value if value is 0', () => {
    const value = 0;
    const normalizedValue = utils.normalizeValueForDom(value);

    expect(normalizedValue).toBe(0);
  });

  it('returns empty string if value is empty string', () => {
    const value = '';
    const normalizedValue = utils.normalizeValueForDom(value);

    expect(normalizedValue).toBe('');
  });

  it('returns empty string if value is null', () => {
    const value = null;
    const normalizedValue = utils.normalizeValueForDom(value);

    expect(normalizedValue).toBe('');
  });

  it('returns empty string if value is undefined', () => {
    const value = undefined;
    const normalizedValue = utils.normalizeValueForDom(value);

    expect(normalizedValue).toBe('');
  });
});
