/* @flow */

import { buildFieldDomIdWithValue } from '../../../../src/modules/ids';

describe('modules.ids.buildFieldDomIdWithValue()', () => {
  it('builds correct `fieldDomId` with value from key path as a string', () => {
    const layerId = 'signupForm';
    const keyPath = 'provider';
    const value = 'facebook';
    const fieldDomId = buildFieldDomIdWithValue(layerId, keyPath, value);

    expect(fieldDomId).toBe('signupForm___provider___facebook');
  });


  it('builds correct `fieldDomId` with value from key path as an array', () => {
    const layerId = 'signupForm';
    const keyPath = ['login', 'provider'];
    const value = 'facebook';
    const fieldDomId = buildFieldDomIdWithValue(layerId, keyPath, value);

    expect(fieldDomId).toBe('signupForm___login___provider___facebook');
  });


  it('throws if value is object', () => {
    const layerId = 'signupForm';
    const keyPath = 'provider';
    const value = { facebook: 'facebook' };

    // $FlowIgnoreMe: Yep, this is Object
    expect(() => buildFieldDomIdWithValue(layerId, keyPath, value)).toThrow();
  });


  it('throws if value is null', () => {
    const layerId = 'signupForm';
    const keyPath = 'provider';
    const value = null;

    expect(() => buildFieldDomIdWithValue(layerId, keyPath, value)).toThrow();
  });


  it('throws if value is undefined', () => {
    const layerId = 'signupForm';
    const keyPath = 'provider';
    const value = undefined;

    expect(() => buildFieldDomIdWithValue(layerId, keyPath, value)).toThrow();
  });
});
