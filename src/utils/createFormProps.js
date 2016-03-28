import * as formUtils    from '../utils';
import { formConstants } from '../enums/formConstants';

export function createFormProps(context) {
  const fields = {};

  for (const fieldStateId of Object.keys(context.state)) {
    const { dataType, fieldId } = formUtils.parseFieldStateId(fieldStateId);

    if (!fields[fieldId]) {
      fields[fieldId] = {};
    }

    if (dataType === formConstants.FIELD_DATA_STATE_ID_PREFIX) {
      fields[fieldId].props = context.state[fieldStateId];
    } else {
      fields[fieldId].message = context.state[fieldStateId].message;
      fields[fieldId].status  = context.state[fieldStateId].status;
    }
  }

  const singleDataSource = formUtils.singleDataSource(context.props);

  function getPropsFor(...keyPath) {
    const fieldId = (
      formUtils.getFieldIdFromKeyPath(singleDataSource, keyPath)
    );
    return this.fields[fieldId].props;
  }

  function getPropsForCheckbox(...keyPath) {
    const fieldId = (
      formUtils.getFieldIdFromKeyPath(singleDataSource, keyPath)
    );
    const stateProps = this.fields[fieldId].props;

    return Object.assign({}, stateProps, { checked: !!stateProps.value });
  }

  function getPropsForRadioButton(keyPath, value) {
    const fieldId = (
      formUtils.getFieldIdFromKeyPath(singleDataSource, keyPath)
    );
    const stateProps = this.fields[fieldId].props;
    const radioButtonProps = Object.assign({}, stateProps);

    radioButtonProps.value = value;
    radioButtonProps.checked = stateProps.value === value;

    if (stateProps.id) {
      radioButtonProps.id = (
        formUtils.getFieldDomIdFromKeyPath(singleDataSource, keyPath, value)
      );
    }

    return radioButtonProps;
  }

  function getCustomPropsFor(keyPath, { value, comparator, disabled }) {
    const fieldId = (
      formUtils.getFieldIdFromKeyPath(singleDataSource, keyPath)
    );
    const stateProps = this.fields[fieldId].props;
    const customProps = Object.assign({}, stateProps);

    if (comparator) {
      customProps.checked = comparator(stateProps.value);
    }

    if (disabled) {
      customProps.disabled = disabled;
    }

    if (stateProps.id && value) {
      customProps.id = (
        formUtils.getFieldDomIdFromKeyPath(singleDataSource, keyPath, value)
      );
    }

    return customProps;
  }

  function getValidFor(...keyPath) {
    const fieldId = (
      formUtils.getFieldIdFromKeyPath(singleDataSource, keyPath)
    );
    return this.fields[fieldId].valid;
  }

  function getMessageFor(...keyPath) {
    const fieldId = (
      formUtils.getFieldIdFromKeyPath(singleDataSource, keyPath)
    );
    return this.fields[fieldId].message;
  }

  function getStatusFor(...keyPath) {
    const fieldId = (
      formUtils.getFieldIdFromKeyPath(singleDataSource, keyPath)
    );
    return this.fields[fieldId].status;
  }

  function getFieldIdFor(...keyPath) {
    return (
      formUtils.getFieldIdFromKeyPath(singleDataSource, keyPath)
    );
  }

  function getDomIdFor(...keyPath) {
    return (
      formUtils.getFieldDomIdFromKeyPath(singleDataSource, keyPath)
    );
  }

  function getDomIdWithValue(keyPath, value) {
    if (!Array.isArray(keyPath)) {
      throw new Error(
        '`keyPath` passed to `fromFields.getFieldDomId` must be an Array'
      );
    }

    return (
      formUtils.getFieldDomIdFromKeyPath(singleDataSource, keyPath, value)
    );
  }

  return {
    fields,

    getPropsFor,
    getPropsForCheckbox,
    getPropsForRadioButton,
    getCustomPropsFor,
    getValidFor,
    getMessageFor,
    getStatusFor,
    getFieldIdFor,
    getDomIdFor,
    getDomIdForRadioButton: getDomIdWithValue,
    getCustomDomIdFor     : getDomIdWithValue,

    handleChange: context.handleCustomChange,
    handleBlur  : context.handleCustomBlur,
    handleSubmit: context.handleSubmit,
  };
}
