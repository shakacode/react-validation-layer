import { feedbackStrategies } from '../enums/feedbackStrategies';

import instant              from './instant';
import onBlurOnly           from './onBlurOnly';
import onFirstBlur          from './onFirstBlur';
import onSubmit             from './onSubmit';
import onSuccess            from './onSuccess';
import onSuccessOrFirstBlur from './onSuccessOrFirstBlur';

export default {
  [feedbackStrategies.INSTANT]                 : instant,
  [feedbackStrategies.ON_BLUR_ONLY]            : onBlurOnly,
  [feedbackStrategies.ON_FIRST_BLUR]           : onFirstBlur,
  [feedbackStrategies.ON_SUBMIT]               : onSubmit,
  [feedbackStrategies.ON_SUCCESS]              : onSuccess,
  [feedbackStrategies.ON_SUCCESS_OR_FIRST_BLUR]: onSuccessOrFirstBlur,
};
