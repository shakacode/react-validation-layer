/* @flow */

import type { Fields, NormalizedFields, Data } from '../types';

import { buildFieldId } from './ids';
import { fetchProp, isPlainObject } from './utils';


/**
 * @desc Validation Layer accepts fields as Object w/ props
 *       (struture of this Object alters the structure of data object).
 *       For internal usage this Object is normalized to flat Array of fields.
 *
 */
export default function normalizeFieldsFromProps(
  fields: Fields,
  data: Data,
  normalizedFields: NormalizedFields = [],
  parentKeyPath: Array<string> = [],
): NormalizedFields {
  const keys = Object.keys(fields);

  let index = -1;
  // eslint-disable-next-line no-plusplus
  while (++index < keys.length) {
    const key = keys[index];
    const fieldsBranch = fields[key];
    const dataBranch = fetchProp(data, key);
    const keyPath = parentKeyPath.concat(key);

    if (isPlainObject(dataBranch)) {
      normalizeFieldsFromProps(
        fieldsBranch,
        dataBranch,
        normalizedFields,
        keyPath,
      );
    } else {
      const id = buildFieldId(keyPath);
      const normalizedField =
        isPlainObject(fieldsBranch)
        ? { id, keyPath, ...fieldsBranch }
        : { id, keyPath }
      ;
      normalizedFields.push(normalizedField);
    }
  }

  return normalizedFields;
}
