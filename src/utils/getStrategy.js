import * as utils from '../utils';

import FeedbackStrategy from '../enums/FeedbackStrategy';

export function getStrategy(context, field) {
  const { props } = context;
  const { INSTANT, INSTANT_TOUCHED_ONLY, ON_CHANGE, ON_SUBMIT } = FeedbackStrategy;

  if ([INSTANT, INSTANT_TOUCHED_ONLY].includes(field.feedbackStrategy)) {
    return field.feedbackStrategy;
  }

  if (
    !utils.isDefined(field.feedbackStrategy)
    && [INSTANT, INSTANT_TOUCHED_ONLY].includes(props.feedbackStrategy)
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
