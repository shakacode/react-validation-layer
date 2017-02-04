/* @flow */

import type { AsyncStrategyHandler } from '../../../types';

import { buildCompleteAsyncValidationResults } from '../utils';

/**
 * @desc Async validation will be triggered on each blur event.
 *
 */
export const onBlur: AsyncStrategyHandler = (
  field,
  value,
  stateContainer,
) => {
  stateContainer.setBluredField(field.id);
  stateContainer.setEmittedField(field.id);

  // [For @flow]: we're making sure it's fine in async validation method
  if (!field.validateAsync) throw new Error();

  // $FlowFixMe: No idea yet how to handle `async | debounced-async` case
  return field.validateAsync(value).then(results => ({
    resolution: buildCompleteAsyncValidationResults(
      field.id,
      results,
      stateContainer.getPropsLevelStatuses(),
      stateContainer.getLayerId(),
    ),
    forValue: value,
  }));
};
