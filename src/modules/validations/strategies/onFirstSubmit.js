/* @flow */

import type { StrategyHandler } from '../../../types';

import { buildCompleteValidationResults, buildEmptyValidationResults } from '../utils';

/**
 * @desc According to this strategy Layer won't emit any results
 *       until user submits the form.
 *       After first results are emitted-feedback is provided on every change.
 *
 */
export const onFirstSubmit: StrategyHandler = (props, field, data, stateContainer) => {
  if (stateContainer.getFormWasSubmitted()) {
    stateContainer.setEmittedField(field.id);
    return buildCompleteValidationResults(props, field, data.value);
  }

  return buildEmptyValidationResults();
};
