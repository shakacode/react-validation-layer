/* @flow */

import type {
  LayerId,
  Data,
  NormalizedFields,
  FieldsPropsState,
  TransformBeforeRender,
} from '../types';

import Constant from '../enums/Constant';

import { getFieldValueHandler } from './getFieldHandler';
import { buildFieldDomId, buildFieldPropsStateId } from './ids';
import { getProp, normalizeValueForDom } from './utils';

/**
 * @desc On each update layer calculates DOM props for each field and stores it in state.
 *       This function calcultates next slice of the state with the fields DOM props.
 *
 */
export default function getFieldsPropsState(
  layerId: LayerId,
  normalizedFields: NormalizedFields,
  data: Data,
  propsLevelTransformBeforeRender: ?TransformBeforeRender,
  isSubmitting: boolean,
): FieldsPropsState {
  return normalizedFields.reduce((fields, field) => {
    const fieldDomId = buildFieldDomId(layerId, field.keyPath);
    const fieldPropsStateId = buildFieldPropsStateId(field.id);

    // $FlowIgnoreMe: We're making sure that value at keyPath is not an object on normalization
    const fieldValue: Value = getProp(data, field.keyPath);
    const fieldNormalizedDomValue = normalizeValueForDom(fieldValue);

    const transformBeforeRender = getFieldValueHandler(
      layerId,
      field.id,
      'transformBeforeRender',
      field.transformBeforeRender,
      propsLevelTransformBeforeRender,
    );

    const fieldDomValue = transformBeforeRender
      ? transformBeforeRender(fieldNormalizedDomValue, data)
      : fieldNormalizedDomValue;

    const isDisabled = isSubmitting || field.disabled;

    return {
      ...fields,
      [fieldPropsStateId]: {
        // data attribute w/ fieldId
        [Constant.FIELD_ID_DOM_DATA_ATTRIBUTE]: field.id,

        // generic dom attributes
        id: fieldDomId,
        name: field.id,
        value: fieldDomValue,
        disabled: isDisabled,
      },
    };
  }, {});
}
