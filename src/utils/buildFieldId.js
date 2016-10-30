import Constant from '../enums/Constant';

export function buildFieldId(dataKey, entityId, attr) {
  const _ = Constant.FIELD_ID_DELIMITER;

  return (
    entityId ?
    `${dataKey}${_}${entityId}${_}${attr}` :
    `${dataKey}${_}${attr}`
  );
}
