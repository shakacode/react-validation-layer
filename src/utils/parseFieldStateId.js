/* eslint-disable key-spacing */

import Constant from '../enums/Constant';

export function parseFieldStateId(fieldStateId) {
  const parsedId = fieldStateId.split(Constant.FIELD_STATE_ID_DELIMITER);

  return {
    dataType: parsedId[0],
    fieldId : parsedId[1],
  };
}
