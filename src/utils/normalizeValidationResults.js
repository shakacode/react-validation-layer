import * as utils from '../utils';

export function normalizeValidationResults(validator, value, props) {
  if (!validator) return { valid: true };

  const results = validator(value, props);

  if (results === true) return { valid: true };
  else if (results === false) return { valid: false };

  const normalizedResults = {};

  normalizedResults.valid = !utils.isDefined(results.valid) || results.valid;

  if (results.status) normalizedResults.status = results.status;
  if (results.message) normalizedResults.message = results.message;

  return normalizedResults;
}
