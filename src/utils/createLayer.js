import * as utils from '../utils';
import Constant from '../enums/Constant';

export function createLayer(context) {
  const fields = {};

  for (const fieldStateId of Object.keys(context.state)) {
    const { dataType, fieldId } = utils.parseFieldStateId(fieldStateId);

    if (!fields[fieldId]) fields[fieldId] = {};

    if (dataType === Constant.FIELD_DATA_STATE_ID_PREFIX) {
      fields[fieldId].props = context.state[fieldStateId];
    } else {
      fields[fieldId].valid = context.state[fieldStateId].valid;
      fields[fieldId].message = context.state[fieldStateId].message;
      fields[fieldId].status = context.state[fieldStateId].status;
    }
  }

  const singleDataSource = utils.singleDataSource(context.props);

  function getPropsFor(...keyPath) {
    const fieldId = utils.getFieldIdFromKeyPath(singleDataSource, keyPath);
    return this.fields[fieldId].props;
  }

  function getCheckboxPropsFor(...keyPath) {
    const fieldId = utils.getFieldIdFromKeyPath(singleDataSource, keyPath);
    const stateProps = this.fields[fieldId].props;

    return { ...stateProps, checked: !!stateProps.value };
  }

  function getRadioButtonPropsFor(keyPath, value) {
    const fieldId = utils.getFieldIdFromKeyPath(singleDataSource, keyPath);
    const stateProps = this.fields[fieldId].props;
    const radioButtonProps = { ...stateProps };

    radioButtonProps.value = value;
    radioButtonProps.checked = stateProps.value === value;

    if (stateProps.id) {
      radioButtonProps.id = utils.getFieldDomIdFromKeyPath(singleDataSource, keyPath, value);
    }

    return radioButtonProps;
  }

  function getCustomPropsFor(keyPath, { value, comparator, disabled }) {
    const fieldId = utils.getFieldIdFromKeyPath(singleDataSource, keyPath);
    const stateProps = this.fields[fieldId].props;
    const customProps = { ...stateProps };

    if (comparator) {
      customProps.checked = comparator(stateProps.value);
    }

    if (disabled) {
      customProps.disabled = disabled;
    }

    if (stateProps.id && value) {
      customProps.id = utils.getFieldDomIdFromKeyPath(singleDataSource, keyPath, value);
    }

    return customProps;
  }

  function getValidityFor(...keyPath) {
    const fieldId = utils.getFieldIdFromKeyPath(singleDataSource, keyPath);
    return this.fields[fieldId].valid;
  }

  function getMessageFor(...keyPath) {
    const fieldId = utils.getFieldIdFromKeyPath(singleDataSource, keyPath);
    return this.fields[fieldId].message;
  }

  function getStatusFor(...keyPath) {
    const fieldId = utils.getFieldIdFromKeyPath(singleDataSource, keyPath);
    return this.fields[fieldId].status;
  }

  function getFieldIdFor(...keyPath) {
    return utils.getFieldIdFromKeyPath(singleDataSource, keyPath);
  }

  function getDomIdFor(...keyPath) {
    return utils.getFieldDomIdFromKeyPath(singleDataSource, keyPath);
  }

  function getDomIdWithValue(keyPath, value) {
    if (!Array.isArray(keyPath)) {
      throw new Error('`keyPath` passed to `fromFields.getFieldDomId` must be an Array');
    }

    return utils.getFieldDomIdFromKeyPath(singleDataSource, keyPath, value);
  }

  return {
    fields,

    getPropsFor,
    getCheckboxPropsFor,
    getRadioButtonPropsFor,
    getCustomPropsFor,
    getValidityFor,
    getMessageFor,
    getStatusFor,
    getFieldIdFor,
    getDomIdFor,
    getDomIdForRadioButton: getDomIdWithValue,
    getCustomDomIdFor: getDomIdWithValue,

    handleChange: context.handleCustomChange,
    handleBlur: context.handleCustomBlur,
    handleSubmit: context.handleSubmit,
  };
}
