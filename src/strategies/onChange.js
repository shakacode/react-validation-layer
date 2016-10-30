import * as utils from '../utils';

export default function onChange(context, field, data, statuses) {
  const validationState = utils.normalizeValidationResults(
    field.validate,
    data.value,
    context.props
  );

  if (!validationState.valid) {
    validationState.status = validationState.status || statuses.error;
  } else if (data.value) {
    validationState.status = validationState.status || statuses.success;
  }

  return validationState;
}
