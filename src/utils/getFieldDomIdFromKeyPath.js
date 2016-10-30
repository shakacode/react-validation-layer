import * as utils from '../utils';
import Constant from '../enums/Constant';

export function getFieldDomIdFromKeyPath(singleDataSource, keyPath, suffix) {
  const _ = Constant.FIELD_DOM_ID_DELIMITER;
  const baseDomId = (
    utils
      .getFieldIdFromKeyPath(singleDataSource, keyPath)
      .split(Constant.FIELD_ID_DELIMITER)
      .join(Constant.FIELD_DOM_ID_DELIMITER)
  );

  return (
    suffix
    ? `${baseDomId}${_}${suffix}`
    : baseDomId
  );
}
