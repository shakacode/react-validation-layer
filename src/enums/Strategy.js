/* @flow */
/* eslint-disable key-spacing */

import type { StrategyEnum } from '../types';

const Strategy: StrategyEnum = Object.freeze({
  DEFAULT                       : 'onFirstSuccessOrFirstBlur',

  ON_MOUNT                      : 'onMount',
  ON_FIRST_CHANGE               : 'onFirstChange',
  ON_FIRST_BLUR                 : 'onFirstBlur',
  ON_FIRST_SUCCESS              : 'onFirstSuccess',
  ON_FIRST_SUCCESS_OR_FIRST_BLUR: 'onFirstSuccessOrFirstBlur',
  ON_FIRST_SUBMIT               : 'onFirstSubmit',
});

export default Strategy;
