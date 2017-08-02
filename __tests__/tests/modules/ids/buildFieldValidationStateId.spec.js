/* @flow */

import { buildFieldValidationStateId } from '../../../../src/modules/ids';

describe('modules.ids.buildFieldValidationStateId()', () => {
  it('builds correct `fieldValidationStateId` from `fieldId` w/ single attribute', () => {
    const fieldId = 'email';
    const fieldValidationStateId = buildFieldValidationStateId(fieldId);

    expect(fieldValidationStateId).toBe('fieldValidationState---email');
  });

  it('builds correct `fieldValidationStateId` from `fieldId` w/ multiple attributes', () => {
    const fieldId = 'user.email';
    const fieldValidationStateId = buildFieldValidationStateId(fieldId);

    expect(fieldValidationStateId).toBe('fieldValidationState---user.email');
  });
});
