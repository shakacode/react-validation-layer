import * as utils from '../utils';

export default function onBlurOnly(context, field, data, statuses, event) {
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

    return validationState;
  }

  return {};
}
