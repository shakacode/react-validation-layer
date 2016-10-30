import * as utils from '../utils';
import strategies from '../strategies';

export function applyStrategy(context, field, data, e) {
  const { props } = context;

  const feedbackStrategy = utils.getStrategy(context, field);
  const statuses = utils.getDefaultStatuses(props);

  const stateKey = utils.buildFieldValidationStateId(data.fieldId);
  const strategy = strategies[feedbackStrategy];
  const validationState = strategy(context, field, data, statuses, e);

  return { [stateKey]: validationState };
}
