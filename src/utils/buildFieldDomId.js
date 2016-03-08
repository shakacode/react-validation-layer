import * as formUtils    from '../utils';
import { formConstants } from '../enums/formConstants';

export function buildFieldDomId(dataKey, entityId, attr) {
  return (
    formUtils
      .buildFieldId(dataKey, entityId, attr)
      .split(formConstants.FIELD_ID_DELIMITER)
      .join(formConstants.FIELD_DOM_ID_DELIMITER)
  );
}
