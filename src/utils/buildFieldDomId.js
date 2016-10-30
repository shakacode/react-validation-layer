import * as utils from '../utils';
import Constant from '../enums/Constant';

export function buildFieldDomId(dataKey, entityId, attr) {
  return (
    utils
      .buildFieldId(dataKey, entityId, attr)
      .split(Constant.FIELD_ID_DELIMITER)
      .join(Constant.FIELD_DOM_ID_DELIMITER)
  );
}
