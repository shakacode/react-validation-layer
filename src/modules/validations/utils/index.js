/* @flow */

import type {
  LayerId,
  FieldId,
  Value,
  Data,
  DomValue,
  Statuses,
  Validate,
  StateContainer,
  NormalizedField,
  ValidationResults,
  EmptyValidationResults,
  NormalizedValidationResults,
  NormalizedAsyncValidationResults,
  IntermediateAsyncValidationResults,
  ValidateAsync,
  DebounceStatusReport,
} from '../../../types';

import DefaultStatus from '../../../enums/DefaultStatus';
import DebounceStatus from '../../../enums/DebounceStatus';

import buildErrorMessage from '../../buildErrorMessage';
import { isDefined, isFunction } from '../../utils';

/**
 * @desc It is possible to return validation result as simple boolean,
 *       as well as Object w/ additional data (i.e. `message` & `status`).
 *       This function normalizes validation results to Object shape.
 *
 */
export function normalizeValidationResults(
  results: ValidationResults,
  layerId?: LayerId,
  fieldId?: FieldId,
): NormalizedValidationResults {
  if (results === true) {
    return { valid: true };
  } else if (results === false) {
    return { valid: false };
  }

  if (!isDefined(results.valid)) {
    throw new Error(
      buildErrorMessage({
        layerId,
        fieldId,
        message: [
          "Can't find `valid` key in the results object from validator.",
          "Make sure it's defined and its value is Boolean",
        ],
      }),
    );
  }

  const normalizedResults: NormalizedValidationResults = {
    valid: results.valid,
  };

  if (results.status) normalizedResults.status = results.status;
  if (results.message) normalizedResults.message = results.message;

  return normalizedResults;
}

/**
 * @desc Applies sync validator and returns normalized validation results.
 *
 */
export function applySyncValidation(
  validator: ?Validate,
  value: Value,
  data: Data,
  layerId: LayerId,
  fieldId?: FieldId,
): NormalizedValidationResults {
  if (!validator) return { valid: true };

  if (validator && !isFunction(validator)) {
    throw new Error(
      buildErrorMessage({
        layerId,
        fieldId,
        message: 'Validator must be a function.',
      }),
    );
  }

  const results = validator(value, data);

  return normalizeValidationResults(results, layerId, fieldId);
}

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
 * @desc Builds Object w/ validation results from synchronous validation.
 *       This results will be emitted to the view component.
 *
 */
export function buildCompleteSyncValidationResults(
  field: NormalizedField,
  value: DomValue | Value,
  data: Data,
  statuses: ?Statuses,
  layerId: LayerId,
): NormalizedValidationResults {
  const defaultStatuses = getDefaultStatuses(statuses);
  const validationState = applySyncValidation(
    field.validate,
    value,
    data,
    layerId,
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
 * @desc Builds Object w/ validation results from asynchronous validation.
 *       This results will be emitted to the view component.
 *
 */
export function buildCompleteAsyncValidationResults(
  fieldId: FieldId,
  results: ValidationResults,
  statuses: ?Statuses,
  layerId: LayerId,
): NormalizedAsyncValidationResults {
  const defaultStatuses = getDefaultStatuses(statuses);
  const validationState = {
    ...normalizeValidationResults(results, layerId, fieldId),
    isAsync: true,
  };

  if (!validationState.valid) {
    validationState.status = validationState.status || defaultStatuses.failure;
  } else {
    validationState.status = validationState.status || defaultStatuses.success;
  }

  // $FlowIssue: exact type + destructuring: https://github.com/facebook/flow/issues/2405
  return validationState;
}

/**
 * @desc Builds Object w/ intermediate async validation results.
 *       These results will be emitted to the view component,
 *       when either debounced or non-debounced async validator
 *       is triggered and we're waiting for remote validation to be resolved.
 *
 */
export function buildIntermediateAsyncValidationResults(): IntermediateAsyncValidationResults {
  return {
    valid: null,
    status: null,
    message: null,
    isProcessing: true,
  };
}

/**
 * @desc Builds Object w/ empty validation results.
 *       These results will be emitted to the view component,
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

/**
 * @desc Debounce async validation calls.
 *       Based on lodash.debounce.
 *
 */

/* eslint-disable no-use-before-define, consistent-return */

export function debounce(async: ValidateAsync, wait: number = 0) {
  let lastContext;
  let lastValue;
  let lastFieldId;
  let lastStateContainer;
  let lastCallTime;
  let timerId;

  function shouldInvoke(time: number): boolean {
    const timeSinceLastCall = time - lastCallTime;

    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0
    );
  }

  function initAsync(): DebounceStatusReport {
    // Start the timer for the invoke async
    timerId = setTimeout(timerExpired, wait);
    // Report initialized
    return { status: DebounceStatus.INITIALIZED };
  }

  function remainingWait(time: number): number {
    const timeSinceLastCall = time - lastCallTime;
    return wait - timeSinceLastCall;
  }

  function timerExpired(): void {
    const time = Date.now();

    if (shouldInvoke(time)) {
      return invokeAsync();
    }

    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function invokeAsync(): void {
    timerId = undefined;

    if (lastValue) {
      return triggerRequest();
    }
  }

  function triggerRequest(): void {
    const context = lastContext;
    const fieldId = lastFieldId;
    const value = lastValue;
    const stateContainer = lastStateContainer;

    lastContext = lastFieldId = lastValue = lastStateContainer = undefined;

    if (!fieldId || !stateContainer) throw new Error();

    // Notify layer about triggered request
    return stateContainer.notifyAsync(
      fieldId,
      value,
      async.call(context, value),
    );
  }

  return function debounced(
    fieldId: FieldId,
    value: Value,
    stateContainer: StateContainer,
  ): DebounceStatusReport {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastCallTime = time;
    lastContext = this;

    lastFieldId = fieldId;
    lastValue = value;
    lastStateContainer = stateContainer;

    // Initialize if it's a first ivokation
    if (isInvoking && timerId === undefined) {
      return initAsync();
    }

    // Start timer if it's not done yet
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }

    // Report debounced
    return { status: DebounceStatus.DEBOUNCED };
  };
}
