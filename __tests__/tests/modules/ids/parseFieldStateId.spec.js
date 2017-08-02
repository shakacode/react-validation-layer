/* @flow */

import { parseFieldStateId } from '../../../../src/modules/ids';

describe('modules.ids.parseFieldStateId()', () => {
  it('parses fieldPropsStateId', () => {
    const fieldPropsStateId = 'fieldPropsState---user.email';
    const parsedFieldStateId = parseFieldStateId(fieldPropsStateId);

    expect(parsedFieldStateId).toEqual({
      dataType: 'fieldPropsState',
      fieldId: 'user.email',
    });
  });

  it('parses fieldValidationStateId', () => {
    const fieldValidationStateId = 'fieldValidationState---user.email';
    const parsedFieldStateId = parseFieldStateId(fieldValidationStateId);

    expect(parsedFieldStateId).toEqual({
      dataType: 'fieldValidationState',
      fieldId: 'user.email',
    });
  });
});
