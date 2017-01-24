/* @flow */
/* eslint-disable key-spacing */

import type { StrategyHandlers } from '../../../types';

import Strategy from '../../../enums/Strategy';

import { instantTouchedOnly } from './instantTouchedOnly';
import { onFirstChange } from './onFirstChange';
import { onFirstBlur } from './onFirstBlur';
import { onFirstSuccess } from './onFirstSuccess';
import { onFirstSuccessOrFirstBlur } from './onFirstSuccessOrFirstBlur';
import { onFirstSubmit } from './onFirstSubmit';


const strategies: StrategyHandlers = {
  [Strategy.INSTANT_TOUCHED_ONLY]          : instantTouchedOnly,
  [Strategy.ON_FIRST_CHANGE]               : onFirstChange,
  [Strategy.ON_FIRST_BLUR]                 : onFirstBlur,
  [Strategy.ON_FIRST_SUCCESS]              : onFirstSuccess,
  [Strategy.ON_FIRST_SUCCESS_OR_FIRST_BLUR]: onFirstSuccessOrFirstBlur,
  [Strategy.ON_FIRST_SUBMIT]               : onFirstSubmit,
};

export default strategies;
