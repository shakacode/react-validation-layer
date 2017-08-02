/* @flow */
/* eslint-disable key-spacing */

import type { ConstantEnum } from '../types';

const Constant: ConstantEnum = Object.freeze({
  DEFAULT_LAYER_ID: 'form',
  DEFAULT_DEBOUNCE_INTERVAL: 700,
  FIELD_ID_DOM_DATA_ATTRIBUTE: 'data-fieldid',
  FIELD_ID_DELIMITER: '.',
  FIELD_ID_COLLECTION_INDEX_DELIMITER: '/',
  FIELD_STATE_ID_DELIMITER: '---',
  FIELD_DOM_ID_DELIMITER: '___',
  FIELD_PROPS_STATE_ID_PREFIX: 'fieldPropsState',
  FIELD_VALIDATION_STATE_ID_PREFIX: 'fieldValidationState',
  COLLECTION_DATA_TYPE: 'collection',
});

export default Constant;
