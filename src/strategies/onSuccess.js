import * as formUtils from '../utils';

export default function onSuccess(context, field, data, statuses, e) {
  const validationState = (
    formUtils.normalizeValidationResults(
      field.validate,
      data.value,
      context.props
    )
  );

  if (validationState.valid && data.value) {
    validationState.status = validationState.status || statuses.success;
  } else if (!data.value && e.type === 'change') {
    validationState.status = null;
  }

  return validationState;
}
