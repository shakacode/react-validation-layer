/* @flow */

import type { AsyncDebouncedStrategyHandler } from '../../../types';

/**
 * @desc Field with this strategy has debounced async validators.
 *       When user starts typing, validator won't be triggered,
 *       but debouncer will report, that wait period has started
 *       or invokation still debounced. So this function returns
 *       only sync reports from debouncer, rather than Promise.
 *       When validator will be invoked from within debouncer,
 *       debouncer will notify state container directly.
 *
 */
export const onChange: AsyncDebouncedStrategyHandler = (
  field,
  value,
  stateContainer,
) => {
  stateContainer.setEmittedField(field.id);

  // [For @flow]: we're making sure it's fine in async validation method
  if (!field.validateAsync) throw new Error();

  // $FlowFixMe: No idea yet how to handle `async | debounced-async` case
  return field.validateAsync(field.id, value, stateContainer);
};
