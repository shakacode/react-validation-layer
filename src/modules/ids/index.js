/* @flow */

import type {
  LayerId,
  FieldId,
  FieldDomId,
  FieldPropsStateId,
  FieldValidationStateId,
  ParsedFieldStateId,
  EnumerableValue,
} from '../../types';

import Constant from '../../enums/Constant';

import buildErrorMessage from '../buildErrorMessage';
import { normalizeKeyPath, isString, isNumber } from '../utils';

/**
 * @desc Builds internal identificator of the field,
 *       e.g. `user.email`
 *
 */
export function buildFieldId(keyPath: Array<string>): FieldId {
  return keyPath.join(Constant.FIELD_ID_DELIMITER);
}

/**
 * @desc Parses internal identificator of the field,
 *       and returns name of the attribute and key path to its value.
 *       e.g. `email` & `['user', 'email']`
 *
 */
export function parseFieldId(
  fieldId: FieldId,
): { attr: string, keyPath: Array<string> } {
  const keyPath = fieldId.split(Constant.FIELD_ID_DELIMITER);
  return { keyPath, attr: keyPath[keyPath.length - 1] };
}

/**
 * @desc Builds internal identificator of the field from a key path.
 *
 */
export function buildFieldIdFromUserKeyPath(
  userKeyPath: string | Array<string>,
): FieldId {
  const normalizedKeyPath = normalizeKeyPath(userKeyPath);
  return buildFieldId(normalizedKeyPath);
}

/**
 * @desc Builds DOM id attribute of the field,
 *       including layerId to namespace it,
 *       e.g. `loginForm___user___email`
 *
 */
export function buildFieldDomId(
  layerId: LayerId,
  keyPath: Array<string>,
): FieldDomId {
  return [layerId].concat(keyPath).join(Constant.FIELD_DOM_ID_DELIMITER);
}

/**
 * @desc Builds DOM id attribute of the field,
 *       including layerId to namespace it
 *       and value in case if it's radio button,
 *       e.g. `signupForm___provider___facebook`
 *
 */
export function buildFieldDomIdWithValue(
  layerId: LayerId,
  userKeyPath: string | Array<string>,
  value: EnumerableValue,
): FieldDomId {
  if (!isString(value) && !isNumber(value)) {
    throw new Error(
      buildErrorMessage({
        layerId,
        message: [
          'Value for dom id must be a string or a number.',
          value ? `Passed value is: ${value}` : null,
          `Field key path: ${JSON.stringify(userKeyPath)}`,
        ],
      }),
    );
  }

  const normalizedKeyPath = normalizeKeyPath(userKeyPath);

  return [layerId]
    .concat(normalizedKeyPath)
    .concat(value)
    .join(Constant.FIELD_DOM_ID_DELIMITER);
}

/**
 * @desc Builds internal identificator of the slice of the state,
 *       that holds DOM props for the field,
 *       e.g. `fieldPropsState---user.email`
 *
 */
export function buildFieldPropsStateId(fieldId: FieldId): FieldPropsStateId {
  const prefix = Constant.FIELD_PROPS_STATE_ID_PREFIX;
  const _ = Constant.FIELD_STATE_ID_DELIMITER;

  return `${prefix}${_}${fieldId}`;
}

/**
 * @desc Builds internal identificator of the slice of the state,
 *       that holds validation results for the field,
 *       e.g. `fieldValidationState---user.email`
 *
 */
export function buildFieldValidationStateId(
  fieldId: FieldId,
): FieldValidationStateId {
  const prefix = Constant.FIELD_VALIDATION_STATE_ID_PREFIX;
  const _ = Constant.FIELD_STATE_ID_DELIMITER;

  return `${prefix}${_}${fieldId}`;
}

/**
 * @desc Parses internal identificator of the slice of the state,
 *       and returns type of data & fieldId,
 *       e.g. `fieldValidationState` & `user.email`
 *
 */
export function parseFieldStateId(
  fieldStateId: FieldPropsStateId | FieldValidationStateId,
): ParsedFieldStateId {
  const [dataType, fieldId] = fieldStateId.split(
    Constant.FIELD_STATE_ID_DELIMITER,
  );
  return { dataType, fieldId };
}
