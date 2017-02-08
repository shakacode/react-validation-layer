/* @flow */

import React from 'react';

import type {
  FieldId,
  Value,
  DomData,
  LayerDomHandlersProps,
} from './types';

import { getFieldDomHandler, getFieldValueHandler } from './modules/getFieldHandler';
import { getNextDataFromDom, getNextDataFromCustomHandler } from './modules/getNextData';
import buildErrorMessage from './modules/buildErrorMessage';

import LayerInterface from './LayerInterface';


/**
 * @desc Stateless container of DOM event handlers:
 *         - onChange
 *         - onBlur
 *         - onSubmit
 *
 */
export default class LayerDomHandlers extends React.Component {

  props: LayerDomHandlersProps;


  /**
   * @desc Change handlers.
   *
   */
  handleDomChange = (event: SyntheticInputEvent): void => {
    const { props } = this;
    const domData = getNextDataFromDom(
      props.layerId,
      props.data,
      event,
    );

    this.handleChange(domData);
  };


  handleCustomChange = (fieldId: FieldId, value: Value): void => {
    const { props } = this;
    const domData = getNextDataFromCustomHandler(fieldId, value, props.data);

    this.handleChange(domData);
  };


  handleChange = (domData: DomData): void => {
    const { props } = this;
    const { stateContainer } = props;

    const field = stateContainer.getNormalizedField(domData.fieldId);
    const filter = getFieldValueHandler(
      props.layerId,
      field.id,
      'filter',
      field.filter,
      props.filter,
    );

    if (
      filter                                // if filter is provided
      && domData.value                      // & there's a value is not an empty string
      && !filter(domData.value, props.data) // & filter function returned false
    ) {
      return;                               // then ignoring this update
    }

    const transformBeforeStore = getFieldValueHandler(
      props.layerId,
      field.id,
      'transformBeforeStore',
      field.transformBeforeStore,
      props.transformBeforeStore,
    );

    const processedValue =
      transformBeforeStore
      ? transformBeforeStore(domData.value, props.data)
      : domData.value
    ;

    const processedDomData = { ...domData, value: processedValue };

    if (domData.event) {
      const handleChange = getFieldDomHandler(
        props.layerId,
        field.id,
        'onChange',
        field.handlers,
        props.handlers,
      );

      // $FlowIgnoreMe: Even getFieldDomHandler throws if onChange is missing, flow can't infer it
      handleChange(processedDomData);
    }

    stateContainer.validateField(field, processedDomData);
  };


  /**
   * @desc Blur handlers.
   *
   */
  handleDomBlur = (event: SyntheticInputEvent): void => {
    const { props } = this;
    const domData = getNextDataFromDom(
      props.layerId,
      props.data,
      event,
    );

    this.handleBlur(domData);
  };


  handleCustomBlur = (
    fieldId: FieldId,
    value: Value,
    event: SyntheticInputEvent,
  ): void => {
    const { props } = this;
    const domData = getNextDataFromCustomHandler(
      fieldId,
      value,
      props.data,
      event,
    );

    this.handleBlur(domData, true);
  };


  handleBlur = (
    domData: DomData,
    isCustom?: boolean = false,
  ): void => {
    const { props } = this;
    const { stateContainer } = props;

    const field = stateContainer.getNormalizedField(domData.fieldId);
    const handleBlur = getFieldDomHandler(
      props.layerId,
      field.id,
      'onBlur',
      field.handlers,
      props.handlers,
    );

    const transformBeforeStore = getFieldValueHandler(
      props.layerId,
      field.id,
      'transformBeforeStore',
      field.transformBeforeStore,
      props.transformBeforeStore,
    );

    const processedValue =
      transformBeforeStore
      ? transformBeforeStore(domData.value, props.data)
      : domData.value
    ;

    const processedDomData = { ...domData, value: processedValue };

    if (!isCustom && handleBlur) handleBlur(processedDomData);

    stateContainer.validateField(field, processedDomData);
  };


  /**
   * @desc Submit handler.
   *
   */
  handleSubmit = (event: SyntheticInputEvent): void => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }

    this.props.stateContainer.triggerSubmission();
  };


  render() {
    const { props } = this;

    const layer = new LayerInterface(props.stateContainer, {
      handleDomBlur: this.handleDomBlur,
      handleDomChange: this.handleDomChange,
      handleCustomBlur: this.handleCustomBlur,
      handleCustomChange: this.handleCustomChange,
      handleSubmit: this.handleSubmit,
    });

    if (typeof props.children !== 'function') {
      throw new Error(buildErrorMessage({
        layerId: props.layerId,
        message: '`children` must be a function',
      }));
    }

    return props.children(layer);
  }
}
