/* @flow */

import { buildFieldId } from '../../../../src/modules/ids';

describe('modules.ids.buildFieldId()', () => {
  it('builds correct field id from single attribute', () => {
    const keyPath = ['email'];
    const fieldId = buildFieldId(keyPath);

    expect(fieldId).toBe('email');
  });


  it('builds correct field id from multiple attributes', () => {
    const keyPath = ['user', 'email'];
    const fieldId = buildFieldId(keyPath);

    expect(fieldId).toBe('user.email');
  });
});
