import * as formUtils from '../utils';

export default function onSubmit(context, field, data, statuses) {
  if (context.formWasSubmitted) {
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

    return validationState;
  }

  return {};
}
