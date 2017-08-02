/* @flow */

import { buildFieldDomId } from '../../../../src/modules/ids';

describe('modules.ids.buildFieldDomId()', () => {
  it('builds correct `fieldDomId` from single attribute', () => {
    const layerId = 'loginForm';
    const keyPath = ['email'];
    const fieldDomId = buildFieldDomId(layerId, keyPath);

    expect(fieldDomId).toBe('loginForm___email');
  });

  it('builds correct `fieldDomId` from multiple attributes', () => {
    const layerId = 'loginForm';
    const keyPath = ['user', 'email'];
    const fieldDomId = buildFieldDomId(layerId, keyPath);

    expect(fieldDomId).toBe('loginForm___user___email');
  });
});
