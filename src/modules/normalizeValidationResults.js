/* @flow */

import type {
  Props,
  Value,
  Validate,
  FieldId,
  NormalizedValidationResults,
} from '../types';

import buildErrorMessage from './buildErrorMessage';
import { isDefined, isFunction } from './utils';


/**
 * @desc It is possible to return validation result as simple boolean,
 *       as well as Object w/ additional data (i.e. `message` & `status`).
 *       This function normalizes validation results to Object shape.
 *
 */
export default function normalizeValidationResults(
  validator: ?Validate,
  value: Value,
  props?: Props,
  fieldId?: FieldId,
): NormalizedValidationResults {
  if (!validator) return { valid: true };

  if (validator && !isFunction(validator)) {
    const showLayerId = props ? props.id : null;
    const showFieldId = fieldId || null;

    // $FlowIgnoreMe: It's gonna be fine
    throw new Error(buildErrorMessage({
      layerId: showLayerId,
      fieldId: showFieldId,
      message: 'Validator must be a function.',
    }));
  }

  const results = validator(value, props);

  if (results === true) {
    return { valid: true };
  } else if (results === false) {
    return { valid: false };
  }

  const normalizedResults: NormalizedValidationResults = {
    valid: !isDefined(results.valid) || results.valid,
  };

  if (results.status) normalizedResults.status = results.status;
  if (results.message) normalizedResults.message = results.message;

  return normalizedResults;
}
