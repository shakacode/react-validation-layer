/* @flow */

import { buildIntermediateAsyncValidationResults } from '../../../../../src/modules/validations/utils';

describe('modules.validation.utils.buildIntermediateAsyncValidationResults()', () => {
  it('returns intermediate async validation results', () => {
    const intermediateAsyncValidationResults = buildIntermediateAsyncValidationResults();

    expect(intermediateAsyncValidationResults).toEqual({
      valid: null,
      status: null,
      message: null,
      isProcessing: true,
    });
  });
});
