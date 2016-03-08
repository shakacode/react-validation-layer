import { feedbackStrategies } from '../enums/feedbackStrategies';

export function getStrategy(context, field) {
  if (context.formWasSubmitted) {
    return feedbackStrategies.ON_SUBMIT;
  }

  if (context.bluredFields[field.attr]) {
    return feedbackStrategies.INSTANT;
  }

  return (
    field.feedbackStrategy ||
    context.props.feedbackStrategy ||
    feedbackStrategies.ON_SUBMIT
  );
}
