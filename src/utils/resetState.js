import * as utils from '../utils';
import Constant from '../enums/Constant';

export function resetState(state, nextFormFieldsData, nextVaidationState) {
  const nextState = { ...state };

  for (const stateKey of Object.keys(nextState)) {
    const { dataType } = utils.parseFieldStateId(stateKey);

    if (dataType === Constant.FIELD_VALIDATION_STATE_ID_PREFIX) {
      nextState[stateKey] = {};
    }
  }

  Object.assign(nextState, nextFormFieldsData, nextVaidationState);

  return nextState;
}
