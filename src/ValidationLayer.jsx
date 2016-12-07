import React, { PropTypes } from 'react';

import * as utils from './utils';
import Constant from './enums/Constant';
import FeedbackStrategy from './enums/FeedbackStrategy';


export class ValidationLayer extends React.Component {

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.element.isRequired,
      PropTypes.func.isRequired,
    ]),

    dataKey: PropTypes.string,
    dataType: PropTypes.oneOf([
      Constant.COLLECTION_DATA_TYPE,
    ]),

    handlers: PropTypes.shape({
      onSubmit: PropTypes.func.isRequired,
    }).isRequired,

    feedbackStrategy: PropTypes.oneOf([
      FeedbackStrategy.INSTANT,
      FeedbackStrategy.INSTANT_TOUCHED_ONLY,
      FeedbackStrategy.ON_CHANGE,
      FeedbackStrategy.ON_BLUR_ONLY,
      FeedbackStrategy.ON_FIRST_BLUR,
      FeedbackStrategy.ON_SUCCESS,
      FeedbackStrategy.ON_SUCCESS_OR_FIRST_BLUR,
      FeedbackStrategy.ON_SUBMIT,
    ]),

    fields: PropTypes.arrayOf(
      PropTypes.shape({
        dataKey: PropTypes.string,                    // Can be global
        dataType: PropTypes.oneOf([                   // Can be global
          Constant.COLLECTION_DATA_TYPE,
        ]),
        attr: PropTypes.string.isRequired,
        validate: PropTypes.func,
        validateAsync: PropTypes.func,
        handlers: PropTypes.object,                   // Can be global
        filter: PropTypes.func,                       // Can be global
        transformBeforeStore: PropTypes.func,         // Can be global
        transformBeforeRender: PropTypes.func,        // Can be global
        omitDomId: PropTypes.bool,                    // Can be global
        omitRef: PropTypes.bool,                      // Can be global
        omitOnChange: PropTypes.bool,                 // Can be global
        omitOnBlur: PropTypes.bool,                   // Can be global

        feedbackStrategy: PropTypes.oneOf([           // Can be global
          FeedbackStrategy.INSTANT,
          FeedbackStrategy.INSTANT_TOUCHED_ONLY,
          FeedbackStrategy.ON_CHANGE,
          FeedbackStrategy.ON_BLUR_ONLY,
          FeedbackStrategy.ON_FIRST_BLUR,
          FeedbackStrategy.ON_SUCCESS,
          FeedbackStrategy.ON_SUCCESS_OR_FIRST_BLUR,
          FeedbackStrategy.ON_SUBMIT,
        ]),
      }).isRequired
    ).isRequired,

    isMultiEntities: PropTypes.bool,

    successStatus: PropTypes.string,
    errorStatus: PropTypes.string,

    setValidationLayerStateResetCallback: PropTypes.func,
  };


  constructor(...args) {
    super(...args);
    this.resetComponent();
  }


  componentWillMount() {
    const nextFormFieldsData = this.getFormFieldsData(this.props);
    const nextVaidationState = this.handleInstantFieldsValidation(this.props);
    const nextState = { ...nextFormFieldsData, ...nextVaidationState };

    this.setState(nextState);
  }


  componentDidMount() {
    const { setValidationLayerStateResetCallback } = this.props;

    if (setValidationLayerStateResetCallback) {
      setValidationLayerStateResetCallback(this.handleSuccessPostSubmitAction);
    }
  }


  componentWillReceiveProps(nextProps) {
    const nextFormFieldsData = this.getFormFieldsData(nextProps);
    const nextVaidationState = this.handleInstantFieldsValidation(nextProps);
    const nextState = { ...nextFormFieldsData, ...nextVaidationState };

    this.setState(nextState);
  }


  resetComponent = () => {
    this.isMultiEntities = this.props.isMultiEntities;

    this.touchedFields = {};
    this.bluredFields = {};
    this.emittedFields = {};

    this.isSubmitting = false;
    this.formWasSubmitted = false;
  };


  setTouchedField = (fieldId) => {
    if (!this.touchedFields[fieldId]) {
      this.touchedFields[fieldId] = true;
    }
  };


  setBluredField = (fieldId) => {
    if (!this.bluredFields[fieldId]) {
      this.bluredFields[fieldId] = true;
    }
    this.setTouchedField(fieldId);
  };


  setEmittedField = (fieldId) => {
    if (!this.emittedFields[fieldId]) {
      this.emittedFields[fieldId] = true;
    }
  };


  getFormFieldsData = (props) => {
    const formFields = {};

    for (const field of props.fields) {
      const { dataKey, entity, entityId, attr } = utils.getFieldIdParts(props, field);

      if (this.isMultiEntities && !entityId) {
        throw new Error('`isMultiEntities` prop is set to `true`, but entity has no `id`');
      }

      const fieldId = utils.buildFieldId(dataKey, entityId, attr);
      const fieldStateId = utils.buildFieldDataStateId(fieldId);

      formFields[fieldStateId] = {};

      formFields[fieldStateId][Constant.FIELD_ID_DATA_ATTRIBUTE] = fieldId;

      const omitDomId = (
        utils.isDefined(field.omitDomId)
        ? field.omitDomId
        : props.omitDomId
      );

      if (!omitDomId) {
        const fieldDomId = utils.buildFieldDomId(dataKey, entityId, attr);
        formFields[fieldStateId].id = fieldDomId;
      }

      const fieldValue = utils.fetchProp(entity, attr);
      const domFieldValue = (
        utils.isDefined(fieldValue) && !utils.isNull(fieldValue)
        ? fieldValue
        : ''
      );

      const transformBeforeRender = field.transformBeforeRender || props.transformBeforeRender;

      formFields[fieldStateId].value = (
        transformBeforeRender
        ? transformBeforeRender(domFieldValue)
        : domFieldValue
      );

      formFields[fieldStateId].disabled = this.isSubmitting || field.disabled;

      const formHandlers = {};

      const { onSubmit, ...sharedHandlers } = props.handlers; // eslint-disable-line no-unused-vars

      const omitOnChange = (
        utils.isDefined(field.omitOnChange)
        ? field.omitOnChange
        : props.omitOnChange
      );

      if (!omitOnChange) {
        formHandlers.onChange = this.handleDomChange;
      }

      const omitOnBlur = (
        utils.isDefined(field.omitOnBlur)
        ? field.omitOnBlur
        : props.omitOnBlur
      );

      if (!omitOnBlur) {
        formHandlers.onBlur = this.handleDomBlur;
      }

      Object.assign(
        formFields[fieldStateId],
        sharedHandlers,
        field.handlers,
        formHandlers
      );
    }

    return formFields;
  };


  handleDomChange = (event) => {
    const domData = utils.getDataFromDom(event);
    this.handleChange(domData, event);
  };


  handleCustomChange = (fieldDomId, value) => {
    const parsedFieldDomId = utils.parseFieldId(fieldDomId);
    const domData = { ...parsedFieldDomId, value };
    this.handleChange(domData);
  };


  handleChange = (domData, event) => {
    this.setTouchedField(domData.fieldId);

    const { props } = this;

    const field = utils.getField(props, domData);
    const filter = field.filter || props.filter;

    if (
      filter                           // if filter function provided
      && domData.value                 // & there's a value (we don't want to filter empty string!)
      && !filter(domData.value, props) // & filter function returned false
    ) {
      return false;                    // then ignoring this update
    }

    const transformBeforeStore = field.transformBeforeStore || props.transformBeforeStore;

    if (transformBeforeStore) {
      domData.value = transformBeforeStore(domData.value);
    }

    if (event) {
      const handleChange = utils.getHandler(field, props, 'onChange');
      handleChange(domData, {
        originalEvent: event,
        handleSubmit: this.handleSubmit,
      });
    }

    return this.handleFieldValidation(field, domData, event);
  };


  handleDomBlur = (event) => {
    const domData = utils.getDataFromDom(event);
    this.handleBlur(domData, event);
  };


  handleCustomBlur = (fieldDomId, value, event) => {
    const parsedFieldDomId = utils.parseFieldId(fieldDomId);
    const domData = { ...parsedFieldDomId, value };
    this.handleBlur(domData, event, true);
  };


  handleBlur = (domData, event, isCustom = false) => {
    this.setTouchedField(domData.fieldId);

    const { props } = this;

    const field = utils.getField(props, domData);
    const handleBlur = utils.getHandler(field, props, 'onBlur');

    const transformBeforeStore = field.transformBeforeStore || props.transformBeforeStore;

    if (transformBeforeStore) {
      domData.value = transformBeforeStore(domData.value);
    }

    if (!isCustom && handleBlur) handleBlur(domData, event);

    const feedbackStrategy = utils.getStrategy(this, field);

    if (
      feedbackStrategy === FeedbackStrategy.INSTANT_TOUCHED_ONLY ||
      feedbackStrategy === FeedbackStrategy.ON_FIRST_BLUR ||
      feedbackStrategy === FeedbackStrategy.ON_BLUR_ONLY ||
      feedbackStrategy === FeedbackStrategy.ON_SUCCESS_OR_FIRST_BLUR
    ) {
      this.handleFieldValidation(field, domData, event);
    }
  };


  validateField = (field, domData, event) => (
    utils.applyStrategy(this, field, domData, event)
  );


  handleFieldValidation = (field, domData, event) => {
    const nextState = this.validateField(field, domData, event);
    this.setState(nextState);
  };


  handleInstantFieldsValidation = (props) => {
    const context = this;
    const { fields } = props;

    const instantFields = fields.filter(field => {
      const strategy = utils.getStrategy(context, field);
      if (strategy === FeedbackStrategy.INSTANT) return true;

      if (strategy === FeedbackStrategy.INSTANT_TOUCHED_ONLY) {
        const { dataKey, entityId, attr } = utils.getFieldIdParts(props, field);
        const fieldId = utils.buildFieldId(dataKey, entityId, attr);
        if (context.touchedFields[fieldId]) return true;
      }

      return false;
    });

    const { validationState } = this.handleBatchValidation(props, instantFields);

    return validationState;
  };


  handleBatchValidation = (props, fields) => {
    const validatableFields = fields || props.fields;

    const validationState = {};
    let isInvalid = false;

    for (const field of validatableFields) {
      const { dataKey, entity, entityId, attr } = utils.getFieldIdParts(props, field);

      const statuses = utils.getDefaultStatuses(props);

      const fieldId = utils.buildFieldId(dataKey, entityId, attr);
      const fieldStateId = utils.buildFieldValidationStateId(fieldId);

      const fieldValue = utils.fetchProp(entity, attr);

      const fieldValidationState = (
        utils.normalizeValidationResults(field.validate, fieldValue, props)
      );

      if (!fieldValidationState.valid) {
        fieldValidationState.status = fieldValidationState.status || statuses.error;
        if (!isInvalid) isInvalid = true;
      } else if (fieldValue) {
        fieldValidationState.status = fieldValidationState.status || statuses.success;
      }

      validationState[fieldStateId] = fieldValidationState;
    }

    return { validationState, isInvalid };
  };


  handleSubmit = (event) => {
    this.isSubmitting = true;

    if (!this.formWasSubmitted) {
      this.formWasSubmitted = true;
    }

    if (event && event.preventDefault && !event.defaultPrevented) {
      event.preventDefault();
    }

    const nextFormFieldsData = this.getFormFieldsData(this.props);

    this.setState(nextFormFieldsData, this.handleFormValidation);
  };


  handleFormValidation = () => {
    const { validationState, isInvalid } = this.handleBatchValidation(this.props);

    if (isInvalid) {
      this.handleFailedFormValidation(validationState);
    } else {
      this.performSubmit();
    }
  };


  handleFailedFormValidation = (validationState) => {
    this.setState(validationState, this.handleFailurePostSubmitAction);
  };


  performSubmit = () => {
    this.props.handlers.onSubmit({
      onSuccess: this.handleSuccessPostSubmitAction,
      onFailure: this.handleFailurePostSubmitAction,
    });
  };


  handleSuccessPostSubmitAction = () => {
    this.resetComponent();

    const nextFormFieldsData = this.getFormFieldsData(this.props);
    const nextVaidationState = this.handleInstantFieldsValidation(this.props);

    const resetedState = utils.resetState(this.state, nextFormFieldsData, nextVaidationState);

    this.setState(resetedState);
  };


  handleFailurePostSubmitAction = () => {
    this.isSubmitting = false;

    const nextFormFieldsData = this.getFormFieldsData(this.props);

    this.setState(nextFormFieldsData);
  };


  printDeprecationWarning = () => {
    if (this.warned) return;

    // eslint-disable-next-line no-console
    console.warn(
      '[Validation Layer Warning]: Direct rendering of the children is deprecated. ' +
      'Use children-as-function way to render your form.'
    );
    this.warned = true;
  };


  render() {
    const { children } = this.props;
    const layer = utils.createLayer(this);

    if (typeof children === 'function') {
      return children(layer);
    }

    this.printDeprecationWarning();
    return React.cloneElement(children, { form: layer });
  }

}
