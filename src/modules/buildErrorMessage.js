/* @flow */

import type { LayerId, FieldId } from '../types';

import Constant from '../enums/Constant';


/**
 * @desc Builds multiline error message with debug info.
 *
 */
export default function buildErrorMessage({
  layerId,
  fieldId,
  message,
}: {
  layerId?: LayerId,
  fieldId?: FieldId,
  message: string | Array<?string>
}): string {
  const normalizedMessage = Array.isArray(message) ? message : [message];
  const isDefaultLayerId = layerId === Constant.DEFAULT_LAYER_ID;
  const layerIdOutput = layerId && !isDefaultLayerId ? `    Layer: ${layerId}` : null;
  const fieldIdOutput = fieldId ? `    Field: ${fieldId}` : null;
  const debugInfoTitle = layerIdOutput || fieldIdOutput ? '--- Debug info:' : null;

  const errorMessage =
    normalizedMessage
      .concat(debugInfoTitle, layerIdOutput, fieldIdOutput)
      .filter(v => v)
      .join('\n')
  ;

  return `[react-validation-layer]: ${errorMessage}`;
}
