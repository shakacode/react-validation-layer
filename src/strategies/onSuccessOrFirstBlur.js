import * as formUtils from '../utils';

export default function onSuccessOrFirstBlur(context, field, data, statuses, e) {
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

  if (!e || e.type === 'blur') {
    if (!validationState.valid) {
      validationState.status = validationState.status || statuses.error;
    } else if (data.value) {
      validationState.status = validationState.status || statuses.success;
    }

    context.setBluredField(data.fieldId);
  }

  return validationState;
}
