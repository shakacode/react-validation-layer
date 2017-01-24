/* @flow */

import { mockNormalizedField } from '../../../helpers';
import { buildFieldDomId } from '../../../../src/modules/ids';

describe('modules.ids.buildFieldDomId()', () => {
  it('builds correct `fieldDomId` from single attribute', () => {
    const layerId = 'loginForm';
    const field = mockNormalizedField({ keyPath: ['email'] });
    const fieldDomId = buildFieldDomId(layerId, field);

    expect(fieldDomId).toBe('loginForm___email');
  });


  it('builds correct `fieldDomId` from multiple attributes', () => {
    const layerId = 'loginForm';
    const field = mockNormalizedField({ keyPath: ['user', 'email'] });
    const fieldDomId = buildFieldDomId(layerId, field);

    expect(fieldDomId).toBe('loginForm___user___email');
  });
});
