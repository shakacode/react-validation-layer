/* @flow */

import type { StrategyHandler } from '../../../types';

import { buildCompleteValidationResults } from '../utils';

/**
 * @desc According to this strategy Layer won't emit any results
 *       until filed is touched by the user (i.e. change or focus -> blur).
 *       After first results are emitted-feedback is instant.
 *
 * NOTE: Generally validations for all the fields with INSTANT-concerned strategies
 *       are triggered from the lifecycle hooks and it shouldn't exist here.
 *       But this strategy is used for single edge case
 *       when user focuses -> blures away from the field w/o a change its value.
 *       In this case validation won't be triggered from lifecycle hook
 *       as blur event doesn't trigger props update, so triggering it from here.
 */
export const instantTouchedOnly: StrategyHandler = (props, field, data, stateContainer) => {
  stateContainer.setBluredField(field.id);
  stateContainer.setEmittedField(field.id);
  return buildCompleteValidationResults(props, field, data.value);
};
