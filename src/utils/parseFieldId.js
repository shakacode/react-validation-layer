/* eslint-disable key-spacing */

import Constant from '../enums/Constant';

export function parseFieldId(id) {
  const parsedId = id.split(Constant.FIELD_ID_DELIMITER);
  const isMultiEntities = parsedId.length === 3;

  if (isMultiEntities) {
    return {
      fieldId : id,
      dataKey : parsedId[0],
      entityId: parsedId[1],
      attr    : parsedId[2],
    };
  }

  return {
    fieldId: id,
    dataKey: parsedId[0],
    attr   : parsedId[1],
  };
}
