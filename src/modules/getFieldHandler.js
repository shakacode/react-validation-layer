/* @flow */

import type {
  Props,
  NormalizedField,
  Filter,
  TransformBeforeStore,
  TransformBeforeRender,
  OnChange,
  OnBlur,
} from '../types';

import buildErrorMessage from './buildErrorMessage';
import { isFunction } from './utils';


/**
 * @desc It is possible to define DOM handler on field level
 *       as well as on props level for all the fields.
 *       This function is figuring out which one to use
 *       for specific field.
 *
 */
export function getFieldDomHandler(
  handlerKey: 'onChange' | 'onBlur',
  field: NormalizedField,
  props: Props,
): ?OnChange | ?OnBlur {
  const fieldLevelHandler = field.handlers && field.handlers[handlerKey];
  const propsLevelHandler = props.handlers && props.handlers[handlerKey];

  const handler = fieldLevelHandler || propsLevelHandler;

  if (handlerKey === 'onChange' && !handler) {
    throw new Error(buildErrorMessage({
      layerId: props.id,
      fieldId: field.id,
      message: `Looks like you forgot to provide \`${handlerKey}\` handler.`,
    }));
  }

  if (handler && !isFunction(handler)) {
    throw new Error(buildErrorMessage({
      layerId: props.id,
      fieldId: fieldLevelHandler && field.id,
      message: `\`${handlerKey}\` must be a function.`,
    }));
  }

  return handler;
}


/**
 * @desc Same as function above, but for value handlers,
 *       i.e. `filter`, `transformBeforeStore` & `transformBeforeRender`.
 *
 */
export function getFieldValueHandler(
  handlerKey: 'filter' | 'transformBeforeStore' | 'transformBeforeRender',
  field: NormalizedField,
  props: Props,
): ?Filter | ?TransformBeforeStore | ?TransformBeforeRender {
  const handler = field[handlerKey] || props[handlerKey];

  if (handler && !isFunction(handler)) {
    throw new Error(buildErrorMessage({
      layerId: props.id,
      fieldId: field[handlerKey] && field.id,
      message: `\`${handlerKey}\` must be a function.`,
    }));
  }

  return handler;
}
