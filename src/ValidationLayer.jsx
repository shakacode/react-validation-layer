import React, { PropTypes } from 'react';

import * as formUtils         from './utils';
import { formConstants }      from './enums/formConstants';
import { feedbackStrategies } from './enums/feedbackStrategies';

// TODO:  - Test stratigies
//        - Add button props
//        - Add async validations
//        - Add collections handling
//        - Add refs
//        - Add focus on first invalid node

export class ValidationLayer extends React.Component {

  static propTypes = {
    children: PropTypes.element.isRequired,

    dataKey : PropTypes.string,
    dataType: PropTypes.oneOf([
      formConstants.COLLECTION_DATA_TYPE,
    ]),

    handlers: PropTypes.shape({
      onSubmit: PropTypes.func.isRequired,
    }).isRequired,

    feedbackStrategy: PropTypes.oneOf([
      feedbackStrategies.INSTANT,
      feedbackStrategies.ON_SUCCESS,
      feedbackStrategies.ON_FIRST_BLUR,
      feedbackStrategies.ON_BLUR_ONLY,
      feedbackStrategies.ON_SUCCESS_OR_FIRST_BLUR,
      feedbackStrategies.ON_SUBMIT,
    ]),

    fields: PropTypes.arrayOf(
      PropTypes.shape({
        dataKey : PropTypes.string,                   // Can be global
        dataType: PropTypes.oneOf([                   // Can be global
          formConstants.COLLECTION_DATA_TYPE,
        ]),
        attr          : PropTypes.string.isRequired,
        validate      : PropTypes.func,
        validateAsync : PropTypes.func,
        handlers      : PropTypes.object,             // Can be global
        filter        : PropTypes.func,               // Can be global
        viewTransform : PropTypes.func,               // Can be global
        storeTransform: PropTypes.func,               // Can be global
        omitDomId     : PropTypes.bool,               // Can be global
        omitRef       : PropTypes.bool,               // Can be global
        omitOnChange  : PropTypes.bool,               // Can be global
        omitOnBlur    : PropTypes.bool,               // Can be global

        feedbackStrategy: PropTypes.oneOf([           // Can be global
          feedbackStrategies.INSTANT,
          feedbackStrategies.ON_SUCCESS,
          feedbackStrategies.ON_FIRST_BLUR,
          feedbackStrategies.ON_BLUR_ONLY,
          feedbackStrategies.ON_SUCCESS_OR_FIRST_BLUR,
          feedbackStrategies.ON_SUBMIT,
        ]),
      }).isRequired
    ).isRequired,

    isMultiEntities: PropTypes.bool,

    successStatus: PropTypes.string,
    errorStatus  : PropTypes.string,
  };


  constructor(props, context) {
    super(props, context);

    this.resetComponent();

    formUtils.bindToContext(this, [
      'resetComponent',
      'setBluredField',
      'handleDomChange',
      'handleCustomChange',
      'handleChange',
      'handleDomBlur',
      'handleCustomBlur',
      'handleBlur',
      'handleFieldValidation',
      'validateField',
      'handleSubmit',
      'handleFailedFormValidation',
      'performSubmit',
      'handleSuccessPostSubmitAction',
      'handleFailurePostSubmitAction',
    ]);
  }


  componentWillMount() {
    const nextFormFieldsData = this.getFormFieldsData(this.props);
    this.setState(nextFormFieldsData);
  }


  componentWillReceiveProps(nextProps) {
    const nextFormFieldsData = this.getFormFieldsData(nextProps);
    this.setState(nextFormFieldsData);
  }


  resetComponent() {
    this.isMultiEntities = this.props.isMultiEntities;

    this.changedFields = {};
    this.bluredFields  = {};

    this.formWasSubmitted = false;
  }


  setChangedField(fieldId) {
    this.changedFields[fieldId] = true;
  }


  setBluredField(fieldId) {
    this.bluredFields[fieldId] = true;
  }


  getFormFieldsData(props, params = {}) {
    const formFields = {};

    for (const field of props.fields) {
      const { dataKey, entity, entityId, attr } = (
        formUtils.getFieldIdParts(props, field)
      );

      if (this.isMultiEntities && !entityId) {
        throw new Error(
          '`isMultiEntities` prop is set to `true`, but entity has no `id`'
        );
      }

      const fieldId = formUtils.buildFieldId(dataKey, entityId, attr);
      const fieldStateId = formUtils.buildFieldDataStateId(fieldId);

      formFields[fieldStateId] = {};

      formFields[fieldStateId][formConstants.FIELD_ID_DATA_ATTRIBUTE] = fieldId;

      const omitDomId = (
        formUtils.isDefined(field.omitDomId) ?
        field.omitDomId :
        props.omitDomId
      );

      if (!omitDomId) {
        const fieldDomId = formUtils.buildFieldDomId(dataKey, entityId, attr);
        formFields[fieldStateId].id = fieldDomId;
      }

      const fieldValue = formUtils.fetchProp(entity, attr);
      const domFieldValue = (
        formUtils.isDefined(fieldValue) && !formUtils.isNull(fieldValue) ?
        fieldValue :
        ''
      );

      const viewTransform = field.viewTransform || props.viewTransform;

      formFields[fieldStateId].value = (
        viewTransform ? viewTransform(domFieldValue) : domFieldValue
      );

      formFields[fieldStateId].disabled = (
        formUtils.isDefined(params.disableAll) ?
        params.disableAll :
        field.disabled
      );

      const formHandlers = {};

      const { onSubmit, ...sharedHandlers } = props.handlers; // eslint-disable-line

      const omitOnChange = (
        formUtils.isDefined(field.omitOnChange) ?
        field.omitOnChange :
        props.omitOnChange
      );

      if (!omitOnChange) {
        formHandlers.onChange = this.handleDomChange;
      }

      const omitOnBlur = (
        formUtils.isDefined(field.omitOnBlur) ?
        field.omitOnBlur :
        props.omitOnBlur
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
  }


  handleDomChange(e) {
    const domData = formUtils.getDataFromDom(e);
    this.handleChange(domData, e);
  }


  handleCustomChange(fieldDomId, value) {
    const parsedFieldDomId = formUtils.parseFieldId(fieldDomId);
    const domData = Object.assign({}, parsedFieldDomId, { value });
    this.handleChange(domData);
  }


  handleChange(domData, e) {
    const { props } = this;

    if (!this.changedFields[domData.fieldId]) {
      this.setChangedField(domData.fieldId);
    }

    const field = formUtils.getField(props, domData);

    const filter = field.filter || props.filter;

    if (filter && domData.value && !filter(domData.value)) {
      return false;
    }

    const storeTransform = field.storeTransform || props.storeTransform;

    if (storeTransform) {
      domData.value = storeTransform(domData.value);
    }

    if (e) {
      const handleChange = formUtils.getHandler(field, props, 'onChange');
      handleChange(domData, {
        originalEvent: e,
        handleSubmit : this.handleSubmit,
      });
    }

    return this.handleFieldValidation(field, domData, e);
  }


  handleDomBlur(e) {
    const domData = formUtils.getDataFromDom(e);
    this.handleBlur(domData, e);
  }


  handleCustomBlur(fieldDomId, value, e) {
    const parsedFieldDomId = formUtils.parseFieldId(fieldDomId);
    const domData = Object.assign({}, parsedFieldDomId, { value });
    this.handleBlur(domData, e, true);
  }


  handleBlur(domData, e, isCustom = false) {
    const { props } = this;

    const field = formUtils.getField(props, domData);
    const handleBlur = formUtils.getHandler(field, props, 'onBlur');

    const storeTransform = field.storeTransform || props.storeTransform;

    if (storeTransform) {
      domData.value = storeTransform(domData.value);
    }

    if (!isCustom && handleBlur) {
      handleBlur(domData, e);
    }

    const feedbackStrategy = formUtils.getStrategy(this, field);

    if (
      feedbackStrategy === feedbackStrategies.ON_FIRST_BLUR ||
      feedbackStrategy === feedbackStrategies.ON_BLUR_ONLY ||
      feedbackStrategy === feedbackStrategies.ON_SUCCESS_OR_FIRST_BLUR
    ) {
      this.handleFieldValidation(field, domData, e);
    }
  }


  handleFieldValidation(field, domData, e) {
    const nextState = this.validateField(field, domData, e);
    this.setState(nextState);
  }


  validateField(field, domData, e) {
    return formUtils.applyStrategy(this, field, domData, e);
  }


  handleSubmit(e) {
    if (!this.formWasSubmitted) {
      this.formWasSubmitted = true;
    }

    if (e && e.preventDefault) {
      e.preventDefault();
    }

    const nextFormFieldsData = (
      this.getFormFieldsData(this.props, { disableAll: true })
    );

    this.setState(nextFormFieldsData, this.handleFormValidation);
  }


  handleFormValidation() {
    const { props } = this;

    const validationState = {};

    let isInvalid = false;

    for (const field of props.fields) {
      const { dataKey, entity, entityId, attr } = (
        formUtils.getFieldIdParts(props, field)
      );

      const statuses = formUtils.getDefaultStatuses(props);

      const fieldId = formUtils.buildFieldId(dataKey, entityId, attr);
      const fieldStateId = formUtils.buildFieldValidationStateId(fieldId);

      const fieldValue = formUtils.fetchProp(entity, attr);

      const fieldValidationState = (
        formUtils.normalizeValidationResults(
          field.validate,
          fieldValue,
          this.props
        )
      );

      if (!fieldValidationState.valid) {
        fieldValidationState.status = (
          fieldValidationState.status || statuses.error
        );
        isInvalid = true;
      } else if (fieldValue) {
        fieldValidationState.status = (
          fieldValidationState.status || statuses.success
        );
      }

      validationState[fieldStateId] = fieldValidationState;
    }

    if (isInvalid) {
      this.handleFailedFormValidation(validationState);
    } else {
      this.performSubmit();
    }
  }


  handleFailedFormValidation(validationState) {
    this.setState(validationState, this.handleFailurePostSubmitAction);
  }


  performSubmit() {
    this.props.handlers.onSubmit(this.handleSuccessPostSubmitAction);
  }


  handleSuccessPostSubmitAction() {
    const { props, state } = this;

    const nextFormFieldsData = this.getFormFieldsData(props);
    const resetedState = formUtils.resetState(state, nextFormFieldsData);

    this.resetComponent();
    this.setState(resetedState);
  }


  handleFailurePostSubmitAction() {
    const nextFormFieldsData = this.getFormFieldsData(this.props);
    this.setState(nextFormFieldsData);
  }


  getFormProps() {
    return { form: formUtils.createFormProps(this) };
  }


  render() {
    const { children } = this.props;
    const formProps    = this.getFormProps();

    return React.cloneElement(children, formProps);
  }

}
