/* @flow */
/* eslint-disable key-spacing */

import type { AsyncStrategyEnum } from '../types';

const AsyncStrategy: AsyncStrategyEnum = Object.freeze({
  DEFAULT  : 'onChange',

  ON_BLUR  : 'onBlur',
  ON_CHANGE: 'onChange',
});

export default AsyncStrategy;
