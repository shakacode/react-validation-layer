/* eslint-disable key-spacing */

import FeedbackStrategy from '../enums/FeedbackStrategy';

import instant from './instant';
import instantTouchedOnly from './instantTouchedOnly';
import onChange from './onChange';
import onBlurOnly from './onBlurOnly';
import onFirstBlur from './onFirstBlur';
import onSuccess from './onSuccess';
import onSuccessOrFirstBlur from './onSuccessOrFirstBlur';
import onSubmit from './onSubmit';

export default {
  [FeedbackStrategy.INSTANT]                 : instant,
  [FeedbackStrategy.INSTANT_TOUCHED_ONLY]    : instantTouchedOnly,
  [FeedbackStrategy.ON_CHANGE]               : onChange,
  [FeedbackStrategy.ON_BLUR_ONLY]            : onBlurOnly,
  [FeedbackStrategy.ON_FIRST_BLUR]           : onFirstBlur,
  [FeedbackStrategy.ON_SUCCESS]              : onSuccess,
  [FeedbackStrategy.ON_SUCCESS_OR_FIRST_BLUR]: onSuccessOrFirstBlur,
  [FeedbackStrategy.ON_SUBMIT]               : onSubmit,
};
