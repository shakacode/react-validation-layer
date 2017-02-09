/* @flow */

import type {
  LayerId,
  FieldId,
  OnChange,
  OnBlur,
  ValueHandler,
  PropsLevelDomHandlers,
  FieldLevelDomHandlers,
} from '../types';

import buildErrorMessage from './buildErrorMessage';
import { isFunction } from './utils';


/**
 * @desc It is possible to define DOM handler on the field level
 *       as well as on the props level for all the fields.
 *       This function figures out which one to use for specific field.
 *
 */
export function getFieldDomHandler(
  layerId: LayerId,
  fieldId: FieldId,
  handlerKey: 'onChange' | 'onBlur',
  fieldLevelDomHandlers: ?FieldLevelDomHandlers,
  propsLevelDomHandlers: PropsLevelDomHandlers,
): ?OnChange | ?OnBlur {
  const fieldLevelHandler = fieldLevelDomHandlers && fieldLevelDomHandlers[handlerKey];
  const propsLevelHandler = propsLevelDomHandlers && propsLevelDomHandlers[handlerKey];

  const handler = fieldLevelHandler || propsLevelHandler;

  if (handlerKey === 'onChange' && !handler) {
    throw new Error(buildErrorMessage({
      layerId,
      fieldId,
      message: `Looks like you forgot to provide \`${handlerKey}\` handler.`,
    }));
  }

  if (handler && !isFunction(handler)) {
    throw new Error(buildErrorMessage({
      layerId,
      fieldId: fieldLevelHandler ? fieldId : null,
      message: `\`${handlerKey}\` must be a function.`,
    }));
  }

  return handler;
}


/**
 * @desc Same as function above, but for value handlers,
 *       i.e. `filter`, `transformBeforeStore` & `transformBeforeRender`.
 *
 * NOTE: Might worth to remove this and allow only `field`-level definitions.
 *       Not documenting it for now.
 *
 */
export function getFieldValueHandler(
  layerId: LayerId,
  fieldId: FieldId,
  handlerKey: 'filter' | 'transformBeforeStore' | 'transformBeforeRender',
  fieldLevelValueHandler: ValueHandler,
  propsLevelValueHandler: ValueHandler,
): ValueHandler {
  const handler = fieldLevelValueHandler || propsLevelValueHandler;

  if (handler && !isFunction(handler)) {
    throw new Error(buildErrorMessage({
      layerId,
      fieldId: fieldLevelValueHandler ? fieldId : null,
      message: `\`${handlerKey}\` must be a function.`,
    }));
  }

  return handler;
}
