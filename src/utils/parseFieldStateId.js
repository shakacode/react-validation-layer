import { formConstants } from '../enums/formConstants';

export function parseFieldStateId(fieldStateId) {
  const parsedId = fieldStateId.split(formConstants.FIELD_STATE_ID_DELIMITER);

  return {
    dataType: parsedId[0],
    fieldId : parsedId[1],
  };
}
