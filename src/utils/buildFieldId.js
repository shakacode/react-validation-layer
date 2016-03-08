import { formConstants } from '../enums/formConstants';

export function buildFieldId(dataKey, entityId, attr) {
  const _ = formConstants.FIELD_ID_DELIMITER;

  return (
    entityId ?
    `${dataKey}${_}${entityId}${_}${attr}` :
    `${dataKey}${_}${attr}`
  );
}
