import * as formUtils from '../utils';

export default function onFirstBlur(context, field, data, statuses, e) {
  if (!e || e.type === 'blur') {
    const validationState = (
      formUtils.normalizeValidationResults(
        field.validate,
        data.value,
        context.props
      )
    );

    if (!validationState.valid) {
      validationState.status = validationState.status || statuses.error;
    } else if (data.value) {
      validationState.status = validationState.status || statuses.success;
    }

    context.setBluredField(data.fieldId);

    return validationState;
  }

  return {};
}
