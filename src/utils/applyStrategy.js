import * as formUtils from '../utils';
import strategies     from '../strategies';

export function applyStrategy(context, field, data, e) {
  const { props } = context;

  const feedbackStrategy = formUtils.getStrategy(context, field);
  const statuses = formUtils.getDefaultStatuses(props);

  const stateKey = formUtils.buildFieldValidationStateId(data.fieldId);
  const strategy = strategies[feedbackStrategy];
  const validationState = strategy(context, field, data, statuses, e);

  return { [stateKey]: validationState };
}
