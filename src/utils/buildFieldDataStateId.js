import Constant from '../enums/Constant';

export function buildFieldDataStateId(fieldId) {
  const idPrefix = Constant.FIELD_DATA_STATE_ID_PREFIX;
  const _ = Constant.FIELD_STATE_ID_DELIMITER;

  return `${idPrefix}${_}${fieldId}`;
}
