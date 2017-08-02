/* @flow */

import type { StrategyHandler } from '../../../types';

import {
  buildCompleteSyncValidationResults,
  buildEmptyValidationResults,
} from '../utils';
import { isBlurEvent } from '../../utils';

/**
 * @desc According to this strategy Layer won't emit any results
 *       until user blures away from a field.
 *       After first results are emitted-feedback is provided on every change.
 *
 */
export const onFirstBlur: StrategyHandler = (
  field,
  value,
  data,
  event,
  stateContainer,
) => {
  const validationState = buildCompleteSyncValidationResults(
    field,
    value,
    data,
    stateContainer.getPropsLevelStatuses(),
    stateContainer.getLayerId(),
  );

  if (event && isBlurEvent(event)) {
    stateContainer.setBluredField(field.id);
    stateContainer.setEmittedField(field.id);
    return validationState;
  }

  if (stateContainer.getEmittedField(field.id)) {
    return validationState;
  }

  return buildEmptyValidationResults();
};
