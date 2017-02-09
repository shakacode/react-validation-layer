/* @flow */
/* eslint-disable key-spacing */

import type { DebounceStatusEnum } from '../types';

const DebounceStatus: DebounceStatusEnum = Object.freeze({
  INITIALIZED: 'initialized',
  DEBOUNCED  : 'debounced',
});

export default DebounceStatus;
