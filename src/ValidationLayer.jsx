/* @flow */

import React from 'react';

import type {
  Props,
  State,
  FieldId,
  NormalizedField,
  DomData,
  Value,
} from './types';

import Constant from './enums/Constant';

import Layer from './containers/Layer';
import StateContainer from './containers/StateContainer';

import {
  performFieldValidation,
  performBatchValidation,
  performInstantFieldsValidation,
} from './modules/validations';
import normalizeFieldsFromProps from './modules/normalizeFieldsFromProps';
import getFieldsPropsState from './modules/getFieldsPropsState';
import resetState from './modules/resetState';
import buildErrorMessage from './modules/buildErrorMessage';
import { buildFieldValidationStateId } from './modules/ids';
import { getFieldDomHandler, getFieldValueHandler } from './modules/getFieldHandler';
import { getNextDataFromDom, getNextDataFromCustomHandler } from './modules/getNextData';
import { isFunction } from './modules/utils';


export class ValidationLayer extends React.Component {

  // Providing default id in vanilla React implementation
  // But id will be required in implementation w/ persisted state
  static defaultProps = { id: Constant.DEFAULT_LAYER_ID };

  props: Props;
  state: State = {};

  stateContainer: StateContainer = new StateContainer(this.props.id);


  componentWillMount(): void {
    const { props, stateContainer } = this;

    // Normalize fields
    const normalizedFields = normalizeFieldsFromProps(props.fields, props.data);
    stateContainer.setNormalizedFields(normalizedFields);

    // Set fields props and validation state for instant fields
    const nextFieldsPropsState = getFieldsPropsState(
      props,
      stateContainer,
      this.handleDomChange,
      this.handleDomBlur,
    );
    const nextFieldsValidationState = performInstantFieldsValidation(props, stateContainer);
    const nextState = { ...nextFieldsPropsState, ...nextFieldsValidationState };

    this.setState(nextState);
  }


  componentWillReceiveProps(nextProps: Props): void {
    const { stateContainer } = this;

    // Update normalized fields
    const normalizedFields = normalizeFieldsFromProps(nextProps.fields, nextProps.data);
    stateContainer.setNormalizedFields(normalizedFields);

    // Update fields props and validation state for instant fields
    const nextFieldsPropsState = getFieldsPropsState(
      nextProps,
      stateContainer,
      this.handleDomChange,
      this.handleDomBlur,
    );
    const nextFieldsValidationState = performInstantFieldsValidation(nextProps, stateContainer);
    const nextState = { ...nextFieldsPropsState, ...nextFieldsValidationState };

    this.setState(nextState);
  }


  resetLayer = (): void => {
    const { props, stateContainer } = this;
    const normalizedFields = normalizeFieldsFromProps(props.fields, props.data);

    stateContainer.resetState(normalizedFields);
  };


  handleDomChange = (event: SyntheticInputEvent): void => {
    const { props, stateContainer } = this;
    const layerId = stateContainer.getLayerId();
    const originalData = props.data;
    const domData = getNextDataFromDom(event, originalData, layerId);

    this.handleChange(domData);
  };


  handleCustomChange = (fieldId: FieldId, value: Value): void => {
    const originalData = this.props.data;
    const domData = getNextDataFromCustomHandler(fieldId, value, originalData);
    this.handleChange(domData);
  };


  handleChange = (domData: DomData): void => {
    const { props, stateContainer } = this;

    const field = stateContainer.getNormalizedField(domData.fieldId);
    const filter = getFieldValueHandler('filter', field, props);

    if (
      filter                           // if filter is provided
      && domData.value                 // & there's a value (we don't want to filter empty string!)
      && !filter(domData.value, props) // & filter function returned false
    ) {
      return;                          // then ignoring this update
    }

    const transformBeforeStore = getFieldValueHandler('transformBeforeStore', field, props);

    const processedValue =
      transformBeforeStore
      ? transformBeforeStore(domData.value, props)
      : domData.value
    ;

    const processedDomData = { ...domData, value: processedValue };

    if (domData.event) {
      const handleChange = getFieldDomHandler('onChange', field, props);

      // $FlowIgnoreMe: Even getFieldDomHandler throws if onChange is missing, flow can't infer it
      handleChange(processedDomData);
    }

    // $FlowIssue: https://github.com/facebook/flow/issues/2405
    this.handleFieldValidation(field, processedDomData);
  };


  handleDomBlur = (event: SyntheticInputEvent): void => {
    const { props, stateContainer } = this;
    const layerId = stateContainer.getLayerId();
    const originalData = props.data;
    const domData = getNextDataFromDom(event, originalData, layerId);

    this.handleBlur(domData);
  };


  handleCustomBlur = (
    fieldId: FieldId,
    value: Value,
    event: SyntheticInputEvent,
  ): void => {
    const originalData = this.props.data;
    const domData = getNextDataFromCustomHandler(fieldId, value, originalData, event);
    this.handleBlur(domData, true);
  };


  handleBlur = (
    domData: DomData,
    isCustom?: boolean = false,
  ): void => {
    const { props, stateContainer } = this;

    const field = stateContainer.getNormalizedField(domData.fieldId);
    const handleBlur = getFieldDomHandler('onBlur', field, props);

    const transformBeforeStore = getFieldValueHandler('transformBeforeStore', field, props);

    const processedValue =
      transformBeforeStore
      ? transformBeforeStore(domData.value, props)
      : domData.value
    ;

    const processedDomData = { ...domData, value: processedValue };

    if (!isCustom && handleBlur) handleBlur(processedDomData);

    // $FlowIssue: https://github.com/facebook/flow/issues/2405
    this.handleFieldValidation(field, processedDomData);
  };


  handleFieldValidation = (
    field: NormalizedField,
    domData: DomData,
  ): void => {
    const { props, stateContainer } = this;
    const nextState = performFieldValidation(props, field, domData, stateContainer);

    if (nextState) {
      const stateKey = buildFieldValidationStateId(field.id);
      this.setState({ [stateKey]: nextState });
    }
  };


  handleSubmit = (event: SyntheticInputEvent): void => {
    const { props, stateContainer } = this;

    stateContainer.setIsSubmitting(true);
    stateContainer.setAllFieldsTouched();
    stateContainer.setFormWasSubmitted();

    if (event && event.preventDefault) {
      event.preventDefault();
    }

    const nextFieldsPropsState = getFieldsPropsState(
      props,
      stateContainer,
      this.handleDomChange,
      this.handleDomBlur,
    );

    this.setState(nextFieldsPropsState, this.handleFormValidationOnSubmit);
  };


  handleFormValidationOnSubmit = (): void => {
    const { props, stateContainer } = this;
    const fields = stateContainer.getNormalizedFields();
    const { validationState, isInvalid } = performBatchValidation(props, fields);

    if (isInvalid) {
      this.setState(validationState, this.handleFailurePostSubmitAction);
    } else {
      props.handlers.onSubmit({
        onSuccess: this.handleSuccessPostSubmitAction,
        onFailure: this.handleFailurePostSubmitAction,
      });
    }
  };


  handleSuccessPostSubmitAction = (): void => {
    this.resetLayer();

    const { props, state, stateContainer } = this;

    const nextFieldsPropsState = getFieldsPropsState(
      props,
      stateContainer,
      this.handleDomChange,
      this.handleDomBlur,
    );
    const nextFieldsValidationState = performInstantFieldsValidation(props, stateContainer);
    const resetedState = resetState(state, nextFieldsPropsState, nextFieldsValidationState);

    this.setState(resetedState);
  };


  handleFailurePostSubmitAction = (): void => {
    const { props, stateContainer } = this;

    stateContainer.setIsSubmitting(false);

    const nextFieldsPropsState = getFieldsPropsState(
      props,
      stateContainer,
      this.handleDomChange,
      this.handleDomBlur,
    );

    this.setState(nextFieldsPropsState);
  };


  render() {
    const { props, state, stateContainer } = this;

    const layer = new Layer(
      state,
      stateContainer,
      {
        handleChange: this.handleCustomChange,
        handleBlur: this.handleCustomBlur,
        handleSubmit: this.handleSubmit,
      },
    );

    if (!isFunction(props.children)) {
      throw new Error(buildErrorMessage({
        layerId: stateContainer.getLayerId(),
        message: '`children` must be a function',
      }));
    }

    // $FlowIgnoreMe: `isFunction` performs check, but Flow can't infer
    return props.children(layer);
  }
}
