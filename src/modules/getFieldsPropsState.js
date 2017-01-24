/* @flow */

import type { Props, FieldsPropsState } from '../types';
import StateContainer from '../containers/StateContainer';

import Constant from '../enums/Constant';

import { getFieldValueHandler } from './getFieldHandler';
import { buildFieldDomId, buildFieldPropsStateId } from './ids';
import { fetchProp, normalizeValueForDom } from './utils';


/**
 * @desc On each update layer calculates DOM props
 *       for each field and stores it in state.
 *       This function calcultates next slice of the state
 *       with the filelds props.
 *
 */
export default function getFieldsPropsState(
  props: Props,
  stateContainer: StateContainer,
  handleDomChange: (event: SyntheticInputEvent) => void,
  handleDomBlur: (event: SyntheticInputEvent) => void,
): FieldsPropsState {
  const normalizedFields = stateContainer.getNormalizedFields();

  return normalizedFields.reduce(
    (fields, field) => {
      const layerId = stateContainer.getLayerId();
      const fieldDomId = buildFieldDomId(layerId, field);
      const fieldPropsStateId = buildFieldPropsStateId(field.id);

      // $FlowIgnoreMe: We're making sure that value at keyPath is not an object on normalization
      const fieldValue: Value = fetchProp(props.data, field.keyPath);
      const fieldNormalizedDomValue = normalizeValueForDom(fieldValue);

      const transformBeforeRender =
        getFieldValueHandler('transformBeforeRender', field, props);

      const fieldDomValue =
        transformBeforeRender
        ? transformBeforeRender(fieldNormalizedDomValue, props)
        : fieldNormalizedDomValue
      ;

      const isDisabled = stateContainer.getIsSubmitting() || field.disabled;

      // eslint-disable-next-line no-unused-vars
      const { onSubmit, ...propsLevelHandlers } = props.handlers;

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

          // handlers
          ...propsLevelHandlers,
          ...field.handlers,
          onChange: handleDomChange,
          onBlur: handleDomBlur,
        },
      };
    },
    {},
  );
}
