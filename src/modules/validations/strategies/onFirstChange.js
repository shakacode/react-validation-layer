/* @flow */

import type { StrategyHandler } from '../../../types';

import { buildCompleteSyncValidationResults } from '../utils';

/**
 * @desc According to this strategy Layer won't emit any results
 *       until user types something in in a field.
 *       After first results are emitted-feedback is provided on every change.
 *
 */
export const onFirstChange: StrategyHandler = (
  field,
  value,
  data,
  event,
  stateContainer,
) => {
  stateContainer.setEmittedField(field.id);
  return buildCompleteSyncValidationResults(
    field,
    value,
    data,
    stateContainer.getPropsLevelStatuses(),
    stateContainer.getLayerId(),
  );
};
