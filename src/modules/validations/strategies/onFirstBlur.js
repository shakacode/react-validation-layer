/* @flow */

import type { StrategyHandler } from '../../../types';

import { buildCompleteValidationResults, buildEmptyValidationResults } from '../utils';
import { isBlurEvent } from '../../utils';

/**
 * @desc According to this strategy Layer won't emit any results
 *       until user blures away from a field.
 *       After first results are emitted-feedback is provided on every change.
 *
 */
export const onFirstBlur: StrategyHandler = (props, field, data, stateContainer) => {
  const validationState = buildCompleteValidationResults(props, field, data.value);

  if (data.event && isBlurEvent(data.event)) {
    stateContainer.setBluredField(field.id);
    stateContainer.setEmittedField(field.id);
    return validationState;
  }

  if (stateContainer.getEmittedField(field.id)) {
    return validationState;
  }

  return buildEmptyValidationResults();
};
