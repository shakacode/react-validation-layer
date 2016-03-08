import { formConstants } from '../enums/formConstants';

export function buildFieldValidationStateId(fieldId) {
  const idPrefix = formConstants.FIELD_VALIDATION_STATE_ID_PREFIX;
  const _        = formConstants.FIELD_STATE_ID_DELIMITER;

  return `${idPrefix}${_}${fieldId}`;
}
