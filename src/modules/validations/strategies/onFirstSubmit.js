/* @flow */

import type { StrategyHandler } from '../../../types';

import { buildCompleteSyncValidationResults, buildEmptyValidationResults } from '../utils';

/**
 * @desc According to this strategy Layer won't emit any results
 *       until user submits the form.
 *       After first results are emitted-feedback is provided on every change.
 *
 */
export const onFirstSubmit: StrategyHandler = (
  field,
  value,
  data,
  event,
  stateContainer,
) => {
  if (stateContainer.getFormWasSubmitted()) {
    stateContainer.setEmittedField(field.id);
    return buildCompleteSyncValidationResults(
      field,
      value,
      data,
      stateContainer.getPropsLevelStatuses(),
      stateContainer.getLayerId(),
    );
  }

  return buildEmptyValidationResults();
};
