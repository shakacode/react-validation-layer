import * as formUtils    from '../utils';
import { formConstants } from '../enums/formConstants';

export function createFormFields(props, state) {
  const fields = {};

  for (const fieldStateId of Object.keys(state)) {
    const { dataType, fieldId } = formUtils.parseFieldStateId(fieldStateId);

    if (!fields[fieldId]) {
      fields[fieldId] = {};
    }

    if (dataType === formConstants.FIELD_DATA_STATE_ID_PREFIX) {
      fields[fieldId].props = state[fieldStateId];
    } else {
      fields[fieldId].message = state[fieldStateId].message;
      fields[fieldId].status  = state[fieldStateId].status;
    }
  }

  const singleDataSource = formUtils.singleDataSource(props);

  function getPropsFor(...keyPath) {
    const fieldId = (
      formUtils.getFieldIdFromKeyPath(singleDataSource, keyPath)
    );
    return this.fields[fieldId].props;
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

  function getDomIdFor(keyPath, suffix) {
    if (!Array.isArray(keyPath)) {
      throw new Error(
        '`keyPath` passed to `fromFields.getFieldDomId` must be an Array'
      );
    }

    return (
      formUtils.getFieldDomIdFromKeyPath(singleDataSource, keyPath, suffix)
    );
  }

  return {
    fields,
    getPropsFor,
    getValidFor,
    getMessageFor,
    getStatusFor,
    getFieldIdFor,
    getDomIdFor,
  };
}
