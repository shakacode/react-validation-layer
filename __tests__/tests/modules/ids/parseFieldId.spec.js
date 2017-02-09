/* @flow */

import { parseFieldId } from '../../../../src/modules/ids';

describe('modules.ids.parseFieldId()', () => {
  it('parses flat field id', () => {
    const fieldId = 'email';
    const { attr, keyPath } = parseFieldId(fieldId);

    expect(attr).toBe('email');
    expect(keyPath).toEqual(['email']);
  });


  it('parses nested field id', () => {
    const fieldId = 'user.email';
    const { attr, keyPath } = parseFieldId(fieldId);

    expect(attr).toBe('email');
    expect(keyPath).toEqual(['user', 'email']);
  });
});
