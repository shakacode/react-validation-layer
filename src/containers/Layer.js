/* @flow */
/* eslint-disable no-underscore-dangle */

import type {
  State,
  LayerId,
  FieldId,
  FieldDomId,
  KeyPath,
  DomValue,
  EnumerableValue,
  FieldBaseProps,
  FieldPropsWithChecked,
  LayerField,
  LayerHandleChange,
  LayerHandleBlur,
  LayerHandleSubmit,
  LayerHandlers,
} from '../types';

import StateContainer from '../containers/StateContainer';

import Constant from '../enums/Constant';

import {
  buildFieldIdFromUserKeyPath,
  buildFieldDomIdWithValue,
  parseFieldStateId,
} from '../modules/ids';

import buildErrorMessage from '../modules/buildErrorMessage';


/**
 * @desc Interface to access ValidationLayer data from the views.
 *
 */
export default class Layer {

  __layerId: LayerId;
  __fields: { [fieldId: string]: LayerField };
  __getField: (keyPath: KeyPath, methodName: string) => LayerField;

  handleChange: LayerHandleChange;
  handleBlur: LayerHandleBlur;
  handleSubmit: LayerHandleSubmit;


  constructor(
    state: State,
    stateContainer: StateContainer,
    handlers: LayerHandlers,
  ) {
    this.__layerId = stateContainer.getLayerId();

    this.__fields = Object.keys(state).reduce(
      (fieldsState, fieldStateId) => {
        const { dataType, fieldId } = parseFieldStateId(fieldStateId);

        const nextFieldState =
          dataType === Constant.FIELD_PROPS_STATE_ID_PREFIX
          ? { props: state[fieldStateId] }
          : { resolution: state[fieldStateId] }
        ;

        return {
          ...fieldsState,
          [fieldId]: {
            ...fieldsState[fieldId],
            ...nextFieldState,
          },
        };
      },
      {},
    );

    this.__getField = (keyPath, methodName) => {
      const layerId = this.__layerId;
      const fieldId = buildFieldIdFromUserKeyPath(keyPath);
      const field = this.__fields[fieldId];

      if (!field) {
        throw new Error(buildErrorMessage({
          layerId,
          fieldId,
          message: [
            `Can't find data for field at provided keyPath: ${JSON.stringify(keyPath)}`,
            `Use string to fetch data for non-nested attributes: e.g. \`layer.${methodName}('email')\``,
            `Use array to fetch data for nested attributes: e.g. \`layer.${methodName}(['user', 'email'])\``,
          ],
        }));
      }

      return field;
    };

    this.handleChange = handlers.handleChange;
    this.handleBlur = handlers.handleBlur;
    this.handleSubmit = handlers.handleSubmit;
  }


  getPropsFor = (keyPath: KeyPath): FieldBaseProps => {
    const field = this.__getField(keyPath, 'getPropsFor');
    return field.props;
  };


  getCheckboxPropsFor = (keyPath: KeyPath): FieldPropsWithChecked => {
    const field = this.__getField(keyPath, 'getCheckboxPropsFor');

    // $FlowIssue: exact type + destructuring: https://github.com/facebook/flow/issues/2405
    return {
      ...field.props,
      checked: !!field.props.value,
    };
  };


  getRadioButtonPropsFor = (
    keyPath: KeyPath,
    value: EnumerableValue,
  ): FieldPropsWithChecked => {
    const layerId = this.__layerId;
    const field = this.__getField(keyPath, 'getRadioButtonPropsFor');

    // $FlowIssue: exact type + destructuring: https://github.com/facebook/flow/issues/2405
    return {
      ...field.props,
      value,
      id: buildFieldDomIdWithValue(layerId, keyPath, value),
      checked: field.props.value === value,
    };
  };


  getCustomPropsFor = (
    keyPath: KeyPath,
    {
      value,
      comparator,
      disabled,
    }: {
      value?: EnumerableValue,
      comparator?: (value: DomValue) => boolean,
      disabled?: ?boolean,
    },
  ): FieldBaseProps | FieldPropsWithChecked => {
    const layerId = this.__layerId;
    const field = this.__getField(keyPath, 'getCustomPropsFor');

    const customProps = { ...field.props };

    if (comparator) {
      customProps.checked = comparator(field.props.value);
    }

    if (disabled) {
      customProps.disabled = disabled;
    }

    if (value) {
      customProps.id = buildFieldDomIdWithValue(layerId, keyPath, value);
    }

    // $FlowIssue: exact type + destructuring: https://github.com/facebook/flow/issues/2405
    return customProps;
  };


  getValidityFor = (keyPath: KeyPath): ?boolean => {
    const field = this.__getField(keyPath, 'getValidityFor');
    return field.resolution ? field.resolution.valid : null;
  };


  getMessageFor = (keyPath: KeyPath): ?string => {
    const field = this.__getField(keyPath, 'getMessageFor');
    return field.resolution ? field.resolution.message : null;
  };


  getStatusFor = (keyPath: KeyPath): ?string => {
    const field = this.__getField(keyPath, 'getStatusFor');
    return field.resolution ? field.resolution.status : null;
  };


  getFieldIdFor = (keyPath: KeyPath): FieldId => {
    const field = this.__getField(keyPath, 'getFieldIdFor');
    return field.props[Constant.FIELD_ID_DOM_DATA_ATTRIBUTE];
  };


  getDomIdFor = (
    keyPath: KeyPath,
    value?: EnumerableValue,
  ): FieldDomId => {
    const layerId = this.__layerId;
    const field = this.__getField(keyPath, 'getStatusFor');

    return (
      value
      ? buildFieldDomIdWithValue(layerId, keyPath, value)
      : field.props.id
    );
  };
}
