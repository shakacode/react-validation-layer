/* @flow */

import type { StrategyHandler } from '../../../types';

import { buildCompleteSyncValidationResults } from '../utils';

/**
 * @desc On mount field validation.
 *       Results will be emitted on mount -> on every change.
 *
 */
export const onMount: StrategyHandler = (
  field,
  value,
  data,
  event,
  stateContainer,
) => {
  return buildCompleteSyncValidationResults(
    field,
    value,
    data,
    stateContainer.getPropsLevelStatuses(),
    stateContainer.getLayerId(),
  );
};
