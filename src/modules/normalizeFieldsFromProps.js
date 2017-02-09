/* @flow */

import type {
  Fields,
  NormalizedFields,
  Data,
  AsyncStrategy as AsyncStrategyType,
} from '../types';

import Constant from '../enums/Constant';
import AsyncStrategy from '../enums/AsyncStrategy';

import { buildFieldId } from './ids';
import { fetchProp, isPlainObject } from './utils';
import { debounce } from './validations/utils';


/**
 * @desc Validation Layer accepts fields as Object w/ props
 *       (struture of this Object replicates the structure of the data object).
 *       For internal usage this Object is normalized to flat Array of fields.
 *       Also it wraps async validators with ON_CHANGE strategy in debouncer.
 *
 */
export default function normalizeFieldsFromProps(
  propsAsyncStrategy: AsyncStrategyType | void,
  propsDebounceInterval: number | void,
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
        propsAsyncStrategy,
        propsDebounceInterval,
        fieldsBranch,
        dataBranch,
        normalizedFields,
        keyPath,
      );
    } else {
      const id = buildFieldId(keyPath);

      if (isPlainObject(fieldsBranch)) {
        const fieldAsyncStrategy =
          propsAsyncStrategy
          || fieldsBranch.asyncStrategy
          || AsyncStrategy.DEFAULT
        ;
        const debounceInterval =
          propsDebounceInterval
          || fieldsBranch.debounceInterval
          || Constant.DEFAULT_DEBOUNCE_INTERVAL
        ;
        const isDebouncedAsyncValidation =
          fieldsBranch.validateAsync
          && fieldAsyncStrategy === AsyncStrategy.ON_CHANGE
        ;

        const normalizedField =
          isDebouncedAsyncValidation
          ?
            ({
              ...fieldsBranch,
              id,
              keyPath,
              validateAsync: debounce(fieldsBranch.validateAsync, debounceInterval),
            })
          :
            ({
              ...fieldsBranch,
              id,
              keyPath,
            })
        ;
        normalizedFields.push(normalizedField);
      } else {
        normalizedFields.push({ id, keyPath });
      }
    }
  }

  return normalizedFields;
}
