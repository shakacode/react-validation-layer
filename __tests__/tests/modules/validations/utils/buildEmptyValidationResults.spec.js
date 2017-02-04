/* @flow */

import { buildEmptyValidationResults } from '../../../../../src/modules/validations/utils';

describe('modules.validation.utils.buildEmptyValidationResults()', () => {
  it('returns empty validation results', () => {
    const emptyValidationResults = buildEmptyValidationResults();

    expect(emptyValidationResults).toEqual({
      valid: null,
      status: null,
      message: null,
    });
  });
});
