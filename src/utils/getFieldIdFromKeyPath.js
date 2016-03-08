import * as formUtils    from '../utils';
import { formConstants } from '../enums/formConstants';

export function getFieldIdFromKeyPath(singleDataSource, keyPath) {
  const fieldIdKeyPath = formUtils.fetchArgsArray(keyPath);

  const idParts = (
    singleDataSource && fieldIdKeyPath[0] !== singleDataSource ?
    [singleDataSource].concat(fieldIdKeyPath) :
    fieldIdKeyPath
  );

  return idParts.join(formConstants.FIELD_ID_DELIMITER);
}
