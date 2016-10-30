import * as utils from '../utils';
import Constant from '../enums/Constant';

export function getFieldIdFromKeyPath(singleDataSource, keyPath) {
  const fieldIdKeyPath = utils.fetchArgsArray(keyPath);

  const idParts = (
    singleDataSource && fieldIdKeyPath[0] !== singleDataSource
    ? [singleDataSource].concat(fieldIdKeyPath)
    : fieldIdKeyPath
  );

  return idParts.join(Constant.FIELD_ID_DELIMITER);
}
