/* @flow */

import type { StrategyHandler } from '../../../types';

import { buildCompleteValidationResults, buildEmptyValidationResults } from '../utils';

/**
 * @desc According to this strategy Layer won't emit any results
 *       until user types in valid value.
 *       After first results are emitted-feedback is provided on every change.
 *
 */
export const onFirstSuccess: StrategyHandler = (props, field, data, stateContainer) => {
  const validationState = buildCompleteValidationResults(props, field, data.value);

  if (stateContainer.getEmittedField(field.id)) {
    return validationState;
  }

  if (validationState.valid) {
    stateContainer.setEmittedField(field.id);
    return validationState;
  }

  return buildEmptyValidationResults();
};
