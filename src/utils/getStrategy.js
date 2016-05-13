import { feedbackStrategies } from '../enums/feedbackStrategies';

import { isDefined } from './isDefined';

export function getStrategy(context, field) {
  const { props } = context;
  const { INSTANT, INSTANT_CHANGED_ONLY, ON_CHANGE, ON_SUBMIT } = feedbackStrategies;

  if ([INSTANT, INSTANT_CHANGED_ONLY].includes(field.feedbackStrategy)) {
    return field.feedbackStrategy;
  }

  if (
    !isDefined(field.feedbackStrategy)
    && [INSTANT, INSTANT_CHANGED_ONLY].includes(props.feedbackStrategy)
  ) {
    return props.feedbackStrategy;
  }

  if (context.formWasSubmitted) {
    return ON_SUBMIT;
  }

  if (context.bluredFields[field.attr]) {
    return ON_CHANGE;
  }

  return (
    field.feedbackStrategy
    || props.feedbackStrategy
    || ON_SUBMIT
  );
}
