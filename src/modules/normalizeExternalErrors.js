/* @flow */

import type { ExternalErrors, NormalizedExternalErrors } from '../types';

import { buildFieldId } from './ids';
import { isPlainObject } from './utils';

/**
 * @desc Normalizes errors, received from `submitCallbacks.onFailure`.
 *       It happens when API rejected submission and responded w/ errors.
 *
 */
export default function normalizeExternalErrors(
  errors: ExternalErrors,
  normalizedErrors?: NormalizedExternalErrors = [],
  parentKeyPath?: Array<string> = [],
): NormalizedExternalErrors {
  const keys = Object.keys(errors);

  let index = -1;
  // eslint-disable-next-line no-plusplus
  while (++index < keys.length) {
    const key = keys[index];
    const errorsBranch = errors[key];
    const keyPath = parentKeyPath.concat(key);

    if (isPlainObject(errorsBranch)) {
      normalizeExternalErrors(errorsBranch, normalizedErrors, keyPath);
    } else {
      normalizedErrors.push({
        fieldId: buildFieldId(keyPath),
        message: errorsBranch,
      });
    }
  }

  return normalizedErrors;
}
