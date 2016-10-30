import Constant from '../enums/Constant';

export function buildFieldValidationStateId(fieldId) {
  const idPrefix = Constant.FIELD_VALIDATION_STATE_ID_PREFIX;
  const _ = Constant.FIELD_STATE_ID_DELIMITER;

  return `${idPrefix}${_}${fieldId}`;
}
