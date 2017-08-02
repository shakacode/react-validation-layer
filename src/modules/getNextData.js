/* @flow */

import type { LayerId, FieldId, Value, Data, DomData } from '../types';

import Constant from '../enums/Constant';

import { parseFieldId } from './ids';
import buildErrorMessage from './buildErrorMessage';

/**
 * @desc When DOM handler is triggered from the view
 *       this function takes event (and some additional data)
 *       and normalizes it to pass to validators & user handlers.
 *
 */
export function getNextDataFromDom(
  layerId: LayerId,
  data: Data,
  event: SyntheticInputEvent,
): DomData {
  const domEl = event.target;

  const { value, checked } = domEl;

  const fieldId = domEl.getAttribute(Constant.FIELD_ID_DOM_DATA_ATTRIBUTE);

  if (!fieldId) {
    throw new Error(
      buildErrorMessage({
        layerId,
        message: "Can't find field id.",
      }),
    );
  }

  const { attr, keyPath } = parseFieldId(fieldId);

  return {
    fieldId,
    attr,
    keyPath,
    value,
    checked,
    data,
    event,
  };
}

/**
 * @desc Same as function above except it normalizes the data
 *       received from custom handler.
 *
 */
export function getNextDataFromCustomHandler(
  fieldId: FieldId,
  value: Value,
  data: Data,
  event?: SyntheticInputEvent,
): DomData {
  const { attr, keyPath } = parseFieldId(fieldId);

  return {
    fieldId,
    attr,
    keyPath,
    value,
    data,
    event,
  };
}
