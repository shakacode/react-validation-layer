import * as formUtils    from '../utils';
import { formConstants } from '../enums/formConstants';

export function getFieldDomIdFromKeyPath(
  singleDataSource, keyPath, suffix
) {
  const baseDomId = (
    formUtils
      .getFieldIdFromKeyPath(singleDataSource, keyPath)
      .split(formConstants.FIELD_ID_DELIMITER)
      .join(formConstants.FIELD_DOM_ID_DELIMITER)
  );

  return (
    suffix ?
    `${baseDomId}${formConstants.FIELD_DOM_ID_DELIMITER}${suffix}` :
    baseDomId
  );
}
