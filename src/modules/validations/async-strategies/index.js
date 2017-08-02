/* @flow */
/* eslint-disable key-spacing */

import type { AsyncStrategyHandlers } from '../../../types';

import AsyncStrategy from '../../../enums/AsyncStrategy';

import { onBlur } from './onBlur';
import { onChange } from './onChange';

const asyncStrategies: AsyncStrategyHandlers = {
  [AsyncStrategy.ON_BLUR]: onBlur,
  [AsyncStrategy.ON_CHANGE]: onChange,
};

export default asyncStrategies;
