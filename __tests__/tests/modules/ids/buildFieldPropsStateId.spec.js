/* @flow */

import { buildFieldPropsStateId } from '../../../../src/modules/ids';

describe('modules.ids.buildFieldPropsStateId()', () => {
  it('builds correct `fieldPropsStateId` from `fieldId` w/ single attribute', () => {
    const fieldId = 'email';
    const fieldPropsStateId = buildFieldPropsStateId(fieldId);

    expect(fieldPropsStateId).toBe('fieldPropsState---email');
  });

  it('builds correct `fieldPropsStateId` from `fieldId` w/ multiple attributes', () => {
    const fieldId = 'user.email';
    const fieldPropsStateId = buildFieldPropsStateId(fieldId);

    expect(fieldPropsStateId).toBe('fieldPropsState---user.email');
  });
});
