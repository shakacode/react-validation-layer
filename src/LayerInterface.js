/* @flow */

import type {
  LayerId,
  FieldId,
  FieldDomId,
  KeyPath,
  DomValue,
  EnumerableValue,
  FieldDomProps,
  FieldDomPropsWithChecked,
  SubmitButtonDomProps,
  StateContainer,
  DomHandler,
  LayerField,
  LayerHandleChange,
  LayerHandleBlur,
  LayerHandleSubmit,
  LayerHandlers,
} from './types';

import Constant from './enums/Constant';

import {
  buildFieldIdFromUserKeyPath,
  buildFieldDomIdWithValue,
  parseFieldStateId,
} from './modules/ids';

import buildErrorMessage from './modules/buildErrorMessage';


/**
 * @desc Interface to access validation layer data from the views.
 *
 */
export default class LayerInterface {

  __layerId: LayerId;
  __fields: { [fieldId: string]: LayerField };
  __getField: (keyPath: KeyPath, methodName: string) => LayerField;

  __isSubmitting: boolean;

  __handleDomBlur: DomHandler;
  __handleDomChange: DomHandler;

  notifyOnBlur: LayerHandleBlur;
  notifyOnChange: LayerHandleChange;
  handleSubmit: LayerHandleSubmit;


  constructor(
    stateContainer: StateContainer,
    handlers: LayerHandlers,
  ) {
    const state = stateContainer.getState();

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

    this.__isSubmitting = stateContainer.getIsSubmitting();

    this.__handleDomBlur = handlers.handleDomBlur;
    this.__handleDomChange = handlers.handleDomChange;

    this.notifyOnBlur = handlers.handleCustomBlur;
    this.notifyOnChange = handlers.handleCustomChange;
    this.handleSubmit = handlers.handleSubmit;
  }


  getPropsFor = (keyPath: KeyPath): FieldDomProps => {
    const field = this.__getField(keyPath, 'getPropsFor');

    // $FlowIssue: exact type + destructuring: https://github.com/facebook/flow/issues/2405
    return {
      ...field.props,
      onBlur: this.__handleDomBlur,
      onChange: this.__handleDomChange,
    };
  };


  getCheckboxPropsFor = (keyPath: KeyPath): FieldDomPropsWithChecked => {
    const field = this.__getField(keyPath, 'getCheckboxPropsFor');

    // $FlowIssue: exact type + destructuring: https://github.com/facebook/flow/issues/2405
    return {
      ...field.props,
      checked: !!field.props.value,
      onBlur: this.__handleDomBlur,
      onChange: this.__handleDomChange,
    };
  };


  getRadioButtonPropsFor = (
    keyPath: KeyPath,
    value: EnumerableValue,
  ): FieldDomPropsWithChecked => {
    const layerId = this.__layerId;
    const field = this.__getField(keyPath, 'getRadioButtonPropsFor');

    // $FlowIssue: exact type + destructuring: https://github.com/facebook/flow/issues/2405
    return {
      ...field.props,
      value,
      id: buildFieldDomIdWithValue(layerId, keyPath, value),
      checked: field.props.value === value,
      onBlur: this.__handleDomBlur,
      onChange: this.__handleDomChange,
    };
  };


  getCustomPropsFor = (
    keyPath: KeyPath,
    {
      value,
      disabled,
      getChecked,
    }: {
      value?: EnumerableValue,
      disabled?: ?boolean,
      getChecked?: (value: DomValue) => boolean,
    },
  ): FieldDomProps | FieldDomPropsWithChecked => {
    const layerId = this.__layerId;
    const field = this.__getField(keyPath, 'getCustomPropsFor');

    const customProps = {
      ...field.props,
      onBlur: this.__handleDomBlur,
      onChange: this.__handleDomChange,
    };

    if (value) {
      customProps.id = buildFieldDomIdWithValue(layerId, keyPath, value);
    }

    if (disabled) {
      customProps.disabled = disabled;
    }

    if (getChecked) {
      customProps.checked = getChecked(field.props.value);
    }

    // $FlowIssue: exact type + destructuring: https://github.com/facebook/flow/issues/2405
    return customProps;
  };


  getSubmitButtonProps = (): SubmitButtonDomProps => ({
    type: 'submit',
    disabled: this.__isSubmitting,
  });


  getValidityFor = (keyPath: KeyPath): boolean | null => {
    const field = this.__getField(keyPath, 'getValidityFor');
    return (
      field.resolution && typeof field.resolution.valid !== 'undefined'
      ? field.resolution.valid
      : null
    );
  };


  isSuccessFor = (keyPath: KeyPath): boolean => {
    const field = this.__getField(keyPath, 'isSuccessFor');
    if (!field.props.value && field.props.value !== 0) {
      return false;
    }
    return !!field.resolution && field.resolution.valid === true;
  };


  isFailureFor = (keyPath: KeyPath): boolean => {
    const field = this.__getField(keyPath, 'isFailureFor');
    return !!field.resolution && field.resolution.valid === false;
  };


  getStatusFor = (keyPath: KeyPath): ?string => {
    const field = this.__getField(keyPath, 'getStatusFor');
    return (
      field.resolution && field.resolution.status
      ? field.resolution.status
      : null
    );
  };


  getMessageFor = (keyPath: KeyPath): ?string => {
    const field = this.__getField(keyPath, 'getMessageFor');
    return (
      field.resolution && field.resolution.message
      ? field.resolution.message
      : null
    );
  };


  getAsyncStatusFor = (keyPath: KeyPath): boolean => {
    const field = this.__getField(keyPath, 'getAsyncStatusFor');
    return (
      field.resolution && typeof field.resolution.isProcessing !== 'undefined'
      ? field.resolution.isProcessing
      : false
    );
  };


  getSubmissionStatus = (): boolean => this.__isSubmitting;


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


  getFieldIdFor = (keyPath: KeyPath): FieldId => {
    const field = this.__getField(keyPath, 'getFieldIdFor');
    return field.props[Constant.FIELD_ID_DOM_DATA_ATTRIBUTE];
  };
}
