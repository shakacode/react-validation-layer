import * as formUtils    from '../utils';
import { formConstants } from '../enums/formConstants';

export function getDataFromDom(e) {
  const domEl     = e.target;
  const fieldId   = domEl.getAttribute(formConstants.FIELD_ID_DATA_ATTRIBUTE);
  const isChecbox = domEl.type === 'checkbox';

  const { dataKey, entityId, attr } = formUtils.parseFieldId(fieldId);

  const value = isChecbox ? domEl.checked : domEl.value;

  return {
    fieldId,
    dataKey,
    entityId,
    attr,
    value,
  };
}
