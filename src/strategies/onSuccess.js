import * as utils from '../utils';

export default function onSuccess(context, field, data, statuses, event) {
  const validationState = utils.normalizeValidationResults(
    field.validate,
    data.value,
    context.props
  );

  if (validationState.valid && data.value) {
    validationState.status = validationState.status || statuses.success;
  } else if (!data.value && event.type === 'change') {
    validationState.status = null;
  }

  return validationState;
}
