import { formConstants } from '../enums/formConstants';

export function buildFieldDataStateId(fieldId) {
  const idPrefix = formConstants.FIELD_DATA_STATE_ID_PREFIX;
  const _        = formConstants.FIELD_STATE_ID_DELIMITER;

  return `${idPrefix}${_}${fieldId}`;
}
