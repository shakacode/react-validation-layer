import * as utils from '../utils';

export default function onFirstBlur(context, field, data, statuses, event) {
  if (!event || event.type === 'blur') {
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

    context.setBluredField(data.fieldId);

    return validationState;
  }

  return {};
}
