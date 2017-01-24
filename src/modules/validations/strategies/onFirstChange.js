/* @flow */

import type { StrategyHandler } from '../../../types';

import { buildCompleteValidationResults } from '../utils';

/**
 * @desc According to this strategy Layer won't emit any results
 *       until user types something in in a field.
 *       After first results are emitted-feedback is provided on every change.
 *
 */
export const onFirstChange: StrategyHandler = (props, field, data, stateContainer) => {
  stateContainer.setEmittedField(field.id);
  return buildCompleteValidationResults(props, field, data.value);
};
