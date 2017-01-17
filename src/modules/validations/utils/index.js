/* @flow */

import type {
  Props,
  Value,
  DomValue,
  Statuses,
  NormalizedField,
  EmptyValidationResults,
  NormalizedValidationResults,
} from '../../../types';

import DefaultStatus from '../../../enums/DefaultStatus';

import normalizeValidationResults from '../../normalizeValidationResults';


/**
 * @desc Calculates default success & failure statuses.
 *
 */
// $FlowIssue: https://github.com/facebook/flow/issues/2977
export function getDefaultStatuses(statuses?: Statuses = {}): Statuses {
  return {
    success: statuses.success || DefaultStatus.SUCCESS,
    failure: statuses.failure || DefaultStatus.FAILURE,
  };
}


/**
 * @desc Builds Object w/ validation results.
 *       This results will be emitted to the view component.
 *
 */
export function buildCompleteValidationResults(
  props: Props,
  field: NormalizedField,
  value: DomValue | Value,
): NormalizedValidationResults {
  const defaultStatuses = getDefaultStatuses(props.statuses);
  const validationState = normalizeValidationResults(
    field.validate,
    value,
    props,
    field.id,
  );

  if (!validationState.valid) {
    validationState.status = validationState.status || defaultStatuses.failure;
  } else if (value) {
    validationState.status = validationState.status || defaultStatuses.success;
  }

  return validationState;
}


/**
 * @desc Builds Object w/ empty validation results.
 *       This results will be emitted to the view component,
 *       but it means that Validation Layer doesn't emit
 *       any results yet according to strategy.
 *
 */
export function buildEmptyValidationResults(): EmptyValidationResults {
  return {
    valid: null,
    status: null,
    message: null,
  };
}
