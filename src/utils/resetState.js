import * as formUtils    from '../utils';
import { formConstants } from '../enums/formConstants';

export function resetState(state, nextFormFieldsData, nextVaidationState) {
  const nextState = Object.assign({}, state);

  for (const stateKey of Object.keys(nextState)) {
    const { dataType } = formUtils.parseFieldStateId(stateKey);

    if (dataType === formConstants.FIELD_VALIDATION_STATE_ID_PREFIX) {
      nextState[stateKey] = {};
    }
  }

  Object.assign(nextState, nextFormFieldsData, nextVaidationState);

  return nextState;
}
