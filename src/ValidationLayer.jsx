/* @flow */

import React, { Component } from 'react';

import type {
  Props,
  State,
  LayerId,
  FieldId,
  Value,
  Data,
  DomData,
  Strategy,
  AsyncStrategy,
  Statuses,
  FieldFlags,
  NormalizedField,
  NormalizedFields,
  FieldsPropsState,
  ValidationResults,
  ExternalErrors,
  FieldValidationStateId,
  ValidationStateWithExternalErrors,
  OngoingAsyncValidations,
  InsuredAsyncValidationResults,
} from './types';

import Constant from './enums/Constant';
import DefaultStatus from './enums/DefaultStatus';

import {
  performFieldValidation,
  performOnMountValidation,
  performOnSubmitValidation,
} from './modules/validations';
import { buildCompleteAsyncValidationResults } from './modules/validations/utils';
import { parseFieldId, parseFieldStateId, buildFieldValidationStateId } from './modules/ids';
import { fetchProp, isFunction } from './modules/utils';
import normalizeFieldsFromProps from './modules/normalizeFieldsFromProps';
import normalizeExternalErrors from './modules/normalizeExternalErrors';
import getFieldsPropsState from './modules/getFieldsPropsState';
import buildErrorMessage from './modules/buildErrorMessage';

import LayerDomHandlers from './LayerDomHandlers';


/**
 * @desc Core component.
 *       Holds and manages state of validation layer.
 *
 */
export default class ValidationLayer extends Component {

  static defaultProps = { id: Constant.DEFAULT_LAYER_ID };

  props: Props;
  state: State = {};

  __layerId: LayerId;

  __normalizedFields: NormalizedFields = [];

  __bluredFields: FieldFlags = {};
  __emittedFields: FieldFlags = {};

  __isSubmitting: boolean = false;
  __formWasSubmitted: boolean = false;


  constructor(props: Props, ...rest: Array<*>): void {
    super(props, ...rest);

    this.__layerId = props.id;

    this.__normalizedFields = normalizeFieldsFromProps(
      props.asyncStrategy,
      props.debounceInterval,
      props.fields,
      props.data,
    );
  }


  /**
   * @desc Lifecycle hooks.
   *
   */
  componentWillMount(): void {
    // Set fields props
    this.setNextFieldsPropsState();
  }


  componentDidMount(): void {
    // Performs validation of fields w/ `onMount` strategy
    this.validateOnMount();
  }


  componentWillReceiveProps(nextProps: Props): void {
    // Update normalized fields
    this.setNextNormalizedFields(nextProps);

    // Update fields props
    this.setNextFieldsPropsState(nextProps);
  }


  /**
   * @desc Internal getters.
   *
   */
  getLayerId = (): LayerId => this.__layerId;
  getState = (): State => this.state;
  getData = (): Data => this.props.data;
  getPropsLevelStrategy = (): ?Strategy => this.props.strategy;
  getPropsLevelAsyncStrategy = (): ?AsyncStrategy => this.props.asyncStrategy;
  getPropsLevelStatuses = (): ?Statuses => this.props.statuses;


  /**
   * @desc Fields DOM props management.
   *
   */
  getNextFieldsPropsState = (nextProps?: ?Props): FieldsPropsState => {
    const props = nextProps || this.props;

    return getFieldsPropsState(
      this.getLayerId(),
      this.getNormalizedFields(),
      props.data,
      props.transformBeforeRender,
      this.getIsSubmitting(),
    );
  };

  setNextFieldsPropsState = (
    nextProps?: ?Props,
    callback?: () => void,
  ): void => {
    const nextState = this.getNextFieldsPropsState(nextProps);
    this.setState(nextState, callback);
  };


  /**
   * @desc Normalized fields management.
   *
   */
  getNormalizedFields = (): NormalizedFields => this.__normalizedFields;

  getNormalizedField = (fieldId: FieldId): NormalizedField => {
    const normalizedField = this.__normalizedFields.find(field => field.id === fieldId);

    if (!normalizedField) {
      const layerId = this.getLayerId();

      throw new Error(buildErrorMessage({
        layerId,
        fieldId,
        message: [
          `Can't find \`field\` at key path: ${fieldId}`,
          'Make sure it exists and has truthy value (e.g. object with options or just `true`).',
        ],
      }));
    }

    return normalizedField;
  }

  setNextNormalizedFields = (nextProps?: Props): void => {
    const props = nextProps || this.props;

    const nextNormalizedFields = normalizeFieldsFromProps(
      props.asyncStrategy,
      props.debounceInterval,
      props.fields,
      props.data,
    );

    // Adding only new fileds to prevent replacement
    // of debounced async validators
    const normalizedFields = nextNormalizedFields.map(nextNormalizedField => {
      const normalizedField = this.__normalizedFields.find(
        field => field.id === nextNormalizedField.id,
      );
      return normalizedField || nextNormalizedField;
    });

    this.__normalizedFields = normalizedFields;
  };


  /**
   * @desc Blured fields management.
   *
   */
  getBluredField = (fieldId: FieldId): ?boolean => this.__bluredFields[fieldId];

  setBluredField = (fieldId: FieldId): void => {
    if (!this.__bluredFields[fieldId]) {
      this.__bluredFields[fieldId] = true;
    }
  };


  /**
   * @desc Emitted fields management.
   *
   */
  getEmittedField = (fieldId: FieldId): ?boolean => this.__emittedFields[fieldId];

  setEmittedField = (fieldId: FieldId): void => {
    if (!this.__emittedFields[fieldId]) {
      this.__emittedFields[fieldId] = true;
    }
  };

  setAllFieldsEmitted = (): void => {
    this.__emittedFields =
      this
        .__normalizedFields
        .map(field => field.id)
        .reduce((fields, fieldId) => ({ ...fields, [fieldId]: true }), {})
    ;
  };


  /**
   * @desc Returns `true` if any ongoing async validation is happening.
   *
   */
  isAnyOngoingAsyncActivity = (): boolean => {
    const { state } = this;
    // $FlowIgnoreMe: Flow, don't be such an ass
    return Object.keys(state).some(stateId => state[stateId].isProcessing);
  };


  /**
   * @desc Get and set flag if form is submitting.
   *
   */
  getIsSubmitting = (): boolean => this.__isSubmitting;

  setIsSubmitting = (isSubmitting: boolean): void => {
    this.__isSubmitting = isSubmitting;
  };


  /**
   * @desc Get and set flag if form was submitted at least once.
   *
   */
  getFormWasSubmitted = (): boolean => this.__formWasSubmitted;

  setFormWasSubmitted = (): void => {
    if (!this.__formWasSubmitted) {
      this.__formWasSubmitted = true;
    }
  };


  /**
   * @desc On mount fields validation.
   *
   */
  validateOnMount = (): void => {
    const { fields } = this.props;
    const { nextSyncState, ongoingAsyncValidations } = performOnMountValidation(fields, this);

    this.setNextValidationState(nextSyncState, ongoingAsyncValidations);
  };


  /**
   * @desc Field validation.
   *       This method is triggered from <LayerDomHandlers />
   *       on `change` & `blur` events.
   *
   */
  validateField = (
    field: NormalizedField,
    domData: DomData,
  ): void => {
    const { nextSyncState, ongoingAsyncValidations } = performFieldValidation(
      field,
      domData.value,
      domData.event,
      this,
    );

    this.setNextValidationState(nextSyncState, ongoingAsyncValidations);
  };


  /**
   * @desc Async validation notifier.
   *       This method is triggered from debouncer,
   *       when async validator is ready to run.
   *
   */
  notifyAsync = (
    fieldId: FieldId,
    value: Value,
    asyncValidation: Promise<ValidationResults>,
  ): void => {
    const stateId = buildFieldValidationStateId(fieldId);

    asyncValidation.then(results => {
      const deferredNextState = {
        resolution: buildCompleteAsyncValidationResults(
          fieldId,
          results,
          this.getPropsLevelStatuses(),
          this.getLayerId(),
        ),
        forValue: value,
      };

      this.setNextDeferredValidationState(stateId, deferredNextState);
    });
  };


  /**
   * @desc Sets next validation state from various validators.
   *
   */
  setNextValidationState = (
    nextSyncState: State,
    ongoingAsyncValidations: OngoingAsyncValidations,
  ): void => {
    if (Object.keys(nextSyncState).length === 0) return;

    this.setState(nextSyncState, () => {
      Object.keys(ongoingAsyncValidations).forEach(stateId => {
        ongoingAsyncValidations[stateId].then(deferredNextState =>
          this.setNextDeferredValidationState(stateId, deferredNextState),
        );
      });
    });
  };


  /**
   * @desc Sets next deferred validation state from async validator
   *       (if it's not obsolete).
   *
   */
  setNextDeferredValidationState = (
    stateId: FieldValidationStateId,
    nextState: InsuredAsyncValidationResults,
  ): void => {
    if (!nextState || !nextState.resolution) return;

    const { props } = this;

    const { fieldId } = parseFieldStateId(stateId);
    const { keyPath } = parseFieldId(fieldId);

    const fieldValue = fetchProp(props.data, keyPath);

    // While async call is being processed,
    // deferred validation state might become obsolete:
    // i.e. value was changed & state was replaced
    // w/ next validation results for the next value
    if (nextState.forValue !== fieldValue) return;

    this.setState({ [stateId]: nextState.resolution });
  };


  /**
   * @desc Form validation.
   *       This method is triggered from <LayerDomHandlers />
   *       on form submission request.
   *
   */
  validateForm = (): void => {
    const { validationState, isValid } = performOnSubmitValidation(
      this.getData(),
      this.getState(),
      this.getNormalizedFields(),
      this.getPropsLevelStatuses(),
      this.getLayerId(),
    );

    if (isValid) {
      const { handlers } = this.props;

      if (!handlers || !handlers.onSubmit || !isFunction(handlers.onSubmit)) {
        throw new Error(buildErrorMessage({
          layerId: this.getLayerId(),
          message: "Make sure `handlers.onSubmit` is exists and it's a function",
        }));
      }

      handlers.onSubmit({
        onSuccess: this.resetState,
        onFailure: this.handleFailurePostSubmitAction,
      });
    } else {
      this.setState(validationState, this.handleFailurePostSubmitAction);
    }
  };


  /**
   * @desc Handler of form submission failure.
   *       This method is triggered from userland, when form submission failed.
   *       It accepts single argument: errors, reported from API (or anywhere else).
   *
   */
  handleFailurePostSubmitAction = (errors?: ExternalErrors): void => {
    this.setIsSubmitting(false);

    if (!errors) return this.setNextFieldsPropsState();

    const nextFieldsPropsState = this.getNextFieldsPropsState();

    const statuses = this.getPropsLevelStatuses();
    const normalizedErrors = normalizeExternalErrors(errors);
    const nextFieldsValidationState: ValidationStateWithExternalErrors =
      normalizedErrors.reduce((nextValidationState, error) => {
        const stateId = buildFieldValidationStateId(error.fieldId);

        return {
          ...nextValidationState,
          [stateId]: {
            valid: false,
            status:
              statuses && statuses.failure
              ? statuses.failure
              : DefaultStatus.FAILURE,
            message: error.message,
            isAsync: true,
          },
        };
      }, {})
    ;

    const nextState = {
      ...nextFieldsPropsState,
      ...nextFieldsValidationState,
    };

    return this.setState(nextState);
  };


  /**
   * @desc State reset. Triggered from userland.
   *       Back to origins on successful form submission.
   *
   */
  resetState = (): void => {
    this.setNextNormalizedFields();

    this.__bluredFields = {};
    this.__emittedFields = {};

    this.__isSubmitting = false;
    this.__formWasSubmitted = false;

    // All values of the state keys must be set to an empty objects
    // to replace stale data, b/c setState() merges updates w/ current state.
    const resetedState = Object.keys(this.state).reduce(
      (nextState, key) => ({ ...nextState, [key]: {} }),
      {},
    );
    const nextFieldsPropsState = this.getNextFieldsPropsState();

    this.setState({ ...resetedState, ...nextFieldsPropsState });
  };


  render() {
    const { props } = this;
    const layerId = this.getLayerId();

    if (typeof props.children !== 'function') {
      throw new Error(buildErrorMessage({
        layerId,
        message: '`children` must be a function',
      }));
    }

    return (
      <LayerDomHandlers
        layerId={layerId}
        stateContainer={this}
        data={props.data}
        filter={props.filter}
        handlers={props.handlers}
        transformBeforeStore={props.transformBeforeStore}
      >
        {layer => props.children && props.children(layer)}
      </LayerDomHandlers>
    );
  }
}
