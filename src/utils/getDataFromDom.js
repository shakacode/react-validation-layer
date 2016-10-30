import * as utils from '../utils';
import Constant from '../enums/Constant';

export function getDataFromDom(event) {
  const domEl = event.target;
  const fieldId = domEl.getAttribute(Constant.FIELD_ID_DATA_ATTRIBUTE);
  const { dataKey, entityId, attr } = utils.parseFieldId(fieldId);
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
