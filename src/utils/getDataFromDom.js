import * as formUtils    from '../utils';
import { formConstants } from '../enums/formConstants';

export function getDataFromDom(e) {
  const domEl = e.target;
  const fieldId = domEl.getAttribute(formConstants.FIELD_ID_DATA_ATTRIBUTE);
  const { dataKey, entityId, attr } = formUtils.parseFieldId(fieldId);
  const { value, checked } = domEl;

  return {
    fieldId,
    dataKey,
    entityId,
    attr,
    value,
    checked,
  };
}
