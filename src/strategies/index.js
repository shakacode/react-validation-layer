import { feedbackStrategies } from '../enums/feedbackStrategies';

import instant              from './instant';
import instantChangedOnly   from './instantChangedOnly';
import onChange             from './onChange';
import onBlurOnly           from './onBlurOnly';
import onFirstBlur          from './onFirstBlur';
import onSubmit             from './onSubmit';
import onSuccess            from './onSuccess';
import onSuccessOrFirstBlur from './onSuccessOrFirstBlur';

export default {
  [feedbackStrategies.INSTANT]                 : instant,
  [feedbackStrategies.INSTANT_CHANGED_ONLY]    : instantChangedOnly,
  [feedbackStrategies.ON_CHANGE]               : onChange,
  [feedbackStrategies.ON_BLUR_ONLY]            : onBlurOnly,
  [feedbackStrategies.ON_FIRST_BLUR]           : onFirstBlur,
  [feedbackStrategies.ON_SUBMIT]               : onSubmit,
  [feedbackStrategies.ON_SUCCESS]              : onSuccess,
  [feedbackStrategies.ON_SUCCESS_OR_FIRST_BLUR]: onSuccessOrFirstBlur,
};
