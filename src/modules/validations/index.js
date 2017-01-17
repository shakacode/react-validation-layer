/* @flow */

import type {
  Props,
  Value,
  DomData,
  NormalizedField,
  NormalizedFields,
  FieldsValidationState,
  EmptyValidationResults,
  NormalizedValidationResults,
} from '../../types';

import StateContainer from '../../containers/StateContainer';

import Strategy from '../../enums/Strategy';

import buildErrorMessage from '../buildErrorMessage';
import { buildFieldValidationStateId } from '../ids';
import { fetchProp, isBlurEvent } from '../utils';

import strategies from './strategies';
import { buildCompleteValidationResults } from './utils';


/**
 * @desc Performs single field validation.
 *       It includes calculation of the right strategy for the field.
 *
 */
export function performFieldValidation(
  props: Props,
  field: NormalizedField,
  data: DomData,
  stateContainer: StateContainer,
): NormalizedValidationResults | EmptyValidationResults | null {
  stateContainer.setTouchedField(field.id);

  const {
    INSTANT,
    INSTANT_TOUCHED_ONLY,
    ON_FIRST_BLUR,
    ON_FIRST_SUCCESS_OR_FIRST_BLUR,
    ON_FIRST_SUBMIT,
  } = Strategy;

  const strategy = field.strategy || props.strategy || ON_FIRST_SUBMIT;


  // Generally all fields with INSTANT-concerned strategies should be ignored here,
  // as those validations will be triggered from lifecycle hooks.
  // Except one case: when user focuses -> blures away from the field w/o a change its value.
  // In this case validation won't be triggered from lifecycle hook
  // as blur event doesn't trigger props update, so triggering it from here.
  if (
    strategy === INSTANT_TOUCHED_ONLY
    && data.event
    && isBlurEvent(data.event)
    && !stateContainer.getBluredField(field.id)
  ) {
    return strategies.instantTouchedOnly(props, field, data, stateContainer);
  }


  // Ignoring fields with INSTANT-concerned strategies
  const instantConcernedStrategy = [INSTANT, INSTANT_TOUCHED_ONLY].includes(strategy);

  if (instantConcernedStrategy) return null;


  // Ignoring blur event, if strategy doesn't care about blur
  const blurConcernedStrategy = [ON_FIRST_BLUR, ON_FIRST_SUCCESS_OR_FIRST_BLUR].includes(strategy);

  if (
    data.event
    && isBlurEvent(data.event)
    && !blurConcernedStrategy
  ) {
    return null;
  }


  // Also ignoring blur event, if strategy is concerned about the first blur,
  // but it's not the first blur event for this field
  if (
    data.event
    && isBlurEvent(data.event)
    && blurConcernedStrategy
    && stateContainer.getBluredField(field.id)
  ) {
    return null;
  }


  // If form was subitted, then switching to ON_FIRST_SUBMIT strategy
  // Otherwise using provided strategy
  const validateWithStrategy =
    stateContainer.getFormWasSubmitted()
    ? strategies.onFirstSubmit
    : strategies[strategy]
  ;

  if (!validateWithStrategy) {
    throw new Error(buildErrorMessage({
      layerId: stateContainer.getLayerId(),
      fieldId: field.id,
      message: `Unknown strategy: ${strategy}. Most likely it's a spelling issue.`,
    }));
  }

  return validateWithStrategy(props, field, data, stateContainer);
}


/**
 * @desc Performs multiple fields validation, i.e.:
 *         - fields w/ instant type strategy
 *         - all fields on form submission
 *
 */
export function performBatchValidation(
  props: Props,
  fields: NormalizedFields,
): {
  validationState: FieldsValidationState,
  isInvalid: boolean,
} {
  return fields.reduce(
    ({ validationState, isInvalid }, field) => {
      // $FlowIgnoreMe: We're making sure that value at keyPath is not an object on normalization
      const value: Value = fetchProp(props.data, field.keyPath);
      const fieldValidationState = buildCompleteValidationResults(props, field, value);
      const fieldValidationStateId = buildFieldValidationStateId(field.id);

      return {
        isInvalid: !fieldValidationState.valid || isInvalid,
        validationState: {
          ...validationState,
          [fieldValidationStateId]: fieldValidationState,
        },
      };
    },
    { validationState: {}, isInvalid: false },
  );
}


/**
 * @desc Performs validation of fields w/ instant type strategy.
 *       It figures out correct set of fields,
 *       then performs batch validation.
 *
 */
export function performInstantFieldsValidation(
  props: Props,
  stateContainer: StateContainer,
): FieldsValidationState {
  const normalizedFields = stateContainer.getNormalizedFields();

  const instantFields = normalizedFields.filter(field => {
    const strategy = field.strategy || props.strategy;

    switch (strategy) {
      case Strategy.INSTANT:
        return true;
      case Strategy.INSTANT_TOUCHED_ONLY:
        return !!stateContainer.getTouchedField(field.id);
      default:
        return false;
    }
  });

  const { validationState } = performBatchValidation(props, instantFields);

  return validationState;
}
