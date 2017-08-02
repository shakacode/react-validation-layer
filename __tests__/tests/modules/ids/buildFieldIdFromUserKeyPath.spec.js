/* @flow */

import { buildFieldIdFromUserKeyPath } from '../../../../src/modules/ids';

describe('modules.ids.buildFieldIdFromUserKeyPath()', () => {
  it('builds fieldId from key path as a string', () => {
    const keyPath = 'email';
    const fieldId = buildFieldIdFromUserKeyPath(keyPath);

    expect(fieldId).toBe('email');
  });

  it('builds fieldId from key path as an array', () => {
    const keyPath = ['user', 'email'];
    const fieldId = buildFieldIdFromUserKeyPath(keyPath);

    expect(fieldId).toBe('user.email');
  });
});
