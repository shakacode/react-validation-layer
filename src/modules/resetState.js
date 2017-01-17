/* @flow */

import type { State, FieldsPropsState, FieldsValidationState } from '../types';

/**
 * @desc When form is successfully submitted, form must be resetted.
 *       To reset the state all its keys must be set to empty objects
 *       to replace stale data, b/c setState() merges updates w/ current state.
 *
 */
export default function resetState(
  state: State,
  nextFieldsPropsState: FieldsPropsState,
  nextFieldsValidationState: FieldsValidationState,
): State {
  const resetedState = Object.keys(state).reduce(
    (nextState, key) => ({ ...nextState, [key]: {} }),
    {},
  );

  return {
    ...resetedState,
    ...nextFieldsPropsState,
    ...nextFieldsValidationState,
  };
}
