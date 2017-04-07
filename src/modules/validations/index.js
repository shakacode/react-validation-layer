/* @flow */

import * as _ from '../utils/lodash';

import type {
  LayerId,
  State,
  Value,
  Data,
  Fields,
  Statuses,
  StateContainer,
  NormalizedField,
  NormalizedFields,
  SyncValidationResults,
  CompositeValidationResults,
  FieldsValidationResults,
  OnSubmitValidationResults,
} from '../../types';

import Strategy from '../../enums/Strategy';
import AsyncStrategy from '../../enums/AsyncStrategy';
import DebounceStatus from '../../enums/DebounceStatus';

import {
  buildEmptyValidationResults,
  buildCompleteSyncValidationResults,
  buildIntermediateAsyncValidationResults,
  buildCompleteAsyncValidationResults,
} from './utils';
import { buildFieldValidationStateId, buildFieldIdFromUserKeyPath } from '../ids';
import { getProp, isBlurEvent, isChangeEvent, isPromise } from '../utils';
import buildErrorMessage from '../buildErrorMessage';

import strategies from './strategies';
import asyncStrategies from './async-strategies';


/**
 * @desc Performs synchronous single field validation.
 *       It includes calculation of the sync strategy for the field.
 *
 */
function performSyncFieldValidation(
  field: NormalizedField,
  value: ?Value,
  data: Data,
  event: ?SyntheticInputEvent,
  stateContainer: StateContainer,
): SyncValidationResults {
  const {
    ON_FIRST_BLUR,
    ON_FIRST_SUCCESS_OR_FIRST_BLUR,
    DEFAULT,
  } = Strategy;

  // Figuring out defined strategy
  const strategy = field.strategy || stateContainer.getPropsLevelStrategy() || DEFAULT;

  // Figuring out defined async strategy
  const asyncStrategy =
    field.asyncStrategy
    || stateContainer.getPropsLevelAsyncStrategy()
    || AsyncStrategy.DEFAULT
  ;

  // Ignoring blur event, if strategies don't care about blur
  const blurConcernedStrategy = [ON_FIRST_BLUR, ON_FIRST_SUCCESS_OR_FIRST_BLUR].includes(strategy);
  const blurConcernedAsyncStrategy =
    !!field.validateAsync
    && asyncStrategy === AsyncStrategy.ON_BLUR
  ;

  if (
    event
    && isBlurEvent(event)
    && !blurConcernedStrategy
    && !blurConcernedAsyncStrategy
  ) {
    return null;
  }


  // Also ignoring blur event, if:
  //   - field doesn't have async validation w/ ON_BLUR strategy
  //   - and sync strategy is concerned about the first blur,
  //     but it's not the first blur event for this field
  if (
    event
    && isBlurEvent(event)
    && blurConcernedStrategy
    && !blurConcernedAsyncStrategy
    && (stateContainer.getBluredField(field.id) || stateContainer.getEmittedField(field.id))
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

  // Validating with the calculated strategy
  const validatedWithStrategy = validateWithStrategy(field, value, data, event, stateContainer);

  // Before emit one more case must be handled:
  // if this is `change` event and validation was successful,
  // but field has also async validation w/ ON_BLUR stategy.
  // In this case not emitting anything until the blur.
  return (
    blurConcernedAsyncStrategy
    && validatedWithStrategy.valid
    && (event && isChangeEvent(event))
    ? buildEmptyValidationResults()
    : validatedWithStrategy
  );
}


/**
 * @desc Performs asynchronous single field validation.
 *       It includes calculation of the async strategy for the field.
 *
 */
function performAsyncFieldValidation(
  syncValidationResults: SyncValidationResults,
  field: NormalizedField,
  value: ?Value,
  event: ?SyntheticInputEvent,
  stateContainer: StateContainer,
): CompositeValidationResults {
  // Don't perform async validation if:
  //   - there is no async validator
  //   - value is empty (no reason to validate empty value on remote)
  //   - value is invalid localy (no reason to validate invalid value on remote)
  //   - sync validation said `don't-provide-feedback-yet`
  const noAsyncValidator = !field.validateAsync;
  const noValue = !value && value !== 0;
  const isSyncValidationInvalid = syncValidationResults && !syncValidationResults.valid;
  const noEmittableSyncResults =
    syncValidationResults
    && syncValidationResults.valid === null
    && syncValidationResults.status === null
    && syncValidationResults.message === null
  ;

  if (
    noAsyncValidator
    || noValue
    || isSyncValidationInvalid
    || noEmittableSyncResults
  ) {
    return syncValidationResults;
  }

  // Figuring out async strategy
  const asyncStrategy =
    field.asyncStrategy
    || stateContainer.getPropsLevelAsyncStrategy()
    || AsyncStrategy.DEFAULT
  ;

  // If it's ON_BLUR and event.type is blur -> validate
  if (
    event
    && isBlurEvent(event)
    && asyncStrategy === AsyncStrategy.ON_BLUR
  ) {
    return asyncStrategies.onBlur(field, value, stateContainer);
  }

  // Don't perform async validation if:
  //   - validation is skipped by sync validator (null value returned)
  //   - it's a change event, but async strategy is ON_BLUR
  const isSyncValidationSkipped = syncValidationResults === null;
  const isOnChangeEventButOnBlurStrategy =
    event
    && isChangeEvent(event)
    && asyncStrategy === AsyncStrategy.ON_BLUR
  ;

  if (
    isSyncValidationSkipped
    || isOnChangeEventButOnBlurStrategy
  ) {
    return syncValidationResults;
  }

  // Otherwise -> debounced ON_CHANGE
  return asyncStrategies.onChange(field, value, stateContainer);
}


/**
 * @desc Controller of sync & async validations.
 *
 */
export function performFieldValidation(
  parentField: NormalizedField,
  parentValue: ?Value,
  parentEvent: ?SyntheticInputEvent,
  stateContainer: StateContainer,
): FieldsValidationResults {
  if (parentField.linkedFields && !Array.isArray(parentField.linkedFields)) {
    throw new Error(buildErrorMessage({
      layerId: stateContainer.getLayerId(),
      fieldId: parentField.id,
      message: '`linkedFields` must be an Array.',
    }));
  }

  // Figuring out set of fields to validate:
  //   - parent field (which's changed triggered validation)
  //   - linked fields (if any)
  //
  // NOTE: Theoretically linked field might has its own linked fields.
  //       Something to keep in mind, but ignoring until first use case.
  const fields =
    parentField.linkedFields
    ?
      parentField.linkedFields.reduce((allFields, keyPath) => {
        const fieldId = buildFieldIdFromUserKeyPath(keyPath);
        return allFields.concat(stateContainer.getNormalizedField(fieldId));
      }, [parentField])
    :
      [parentField]
  ;

  // As we (might) have multiple fields to validate,
  // we don't want to trigger state update for each field separately,
  // but we want to batch updates and set next state within single transaction:
  // set sync valiudation results + start processing async ones.
  // Later on, when async results will be resolved ->
  // state will be updated again for each resolved field separetly.
  // Sync state will be packed under `nextSyncState` key,
  // Promises w/ ongoing async validations - under `ongoingAsyncValidations` key.
  const origin = { nextSyncState: {}, ongoingAsyncValidations: {} };

  return fields.reduce((results, field) => {
    const isParentField = field.id === parentField.id;

    const currentData = stateContainer.getData();

    // $FlowIgnoreMe: We're making sure that value at keyPath is not an object on normalization
    const value: ?Value = isParentField ? parentValue : getProp(currentData, field.keyPath);
    const event = isParentField ? parentEvent : null;

    // If it's a linked field, data must be updated w/ the next value of parent field.
    // Not doing this for parent field as it affects perf.
    const data =
      isParentField
      ? currentData
      : _.set(_.cloneDeep(currentData), parentField.keyPath, parentValue)
    ;

    // Performing sync -> async validations
    const syncValidationResults = performSyncFieldValidation(
      field,
      value,
      data,
      event,
      stateContainer,
    );
    const finalValidationResults = performAsyncFieldValidation(
      syncValidationResults,
      field,
      value,
      event,
      stateContainer,
    );

    // If no results returned or it's a debounced results -> ignoring them
    if (
      !finalValidationResults
      || finalValidationResults.status === DebounceStatus.DEBOUNCED
    ) {
      return results;
    }

    const stateId = buildFieldValidationStateId(field.id);

    // If it's a Promise, it means that we should set state of this field to processing
    // and store Promise to update validation state later on (in the core component)
    if (isPromise(finalValidationResults)) {
      return {
        nextSyncState: {
          ...results.nextSyncState,
          [stateId]: buildIntermediateAsyncValidationResults(),
        },
        ongoingAsyncValidations: {
          ...results.ongoingAsyncValidations,
          [stateId]: finalValidationResults,
        },
      };
    }

    // If it's a message from the debouncer w/ the status INITIALIZED ->
    // just starting processing the field.
    // Debouncer will notify state container about triggered request directly
    // and pass Promise within notification
    if (finalValidationResults.status === DebounceStatus.INITIALIZED) {
      return {
        nextSyncState: {
          ...results.nextSyncState,
          [stateId]: buildIntermediateAsyncValidationResults(),
        },
        ongoingAsyncValidations: results.ongoingAsyncValidations,
      };
    }

    // Otherwise it's a results of sync validation. Just merging them.
    return {
      nextSyncState: {
        ...results.nextSyncState,
        [stateId]: finalValidationResults,
      },
      ongoingAsyncValidations: results.ongoingAsyncValidations,
    };
  }, origin);
}


/**
 * @desc Performs fields validation on mount.
 *
 */
export function performOnMountValidation(
  fields: Fields,
  stateContainer: StateContainer,
): FieldsValidationResults {
  const layerId = stateContainer.getLayerId();
  const data = stateContainer.getData();
  const normalizedFields = stateContainer.getNormalizedFields();
  const propsLevelStatuses = stateContainer.getPropsLevelStatuses();
  const propsLevelStrategy = stateContainer.getPropsLevelStrategy();
  const propsLevelAsyncStrategy = stateContainer.getPropsLevelAsyncStrategy();

  const origin = { nextSyncState: {}, ongoingAsyncValidations: {} };

  return (
    normalizedFields
      .filter(field => (field.strategy || propsLevelStrategy) === Strategy.ON_MOUNT)
      .reduce(({ nextSyncState, ongoingAsyncValidations }, field) => {
        stateContainer.setEmittedField(field.id);

        // $FlowIgnoreMe: We're making sure that value at keyPath is not an object on normalization
        const value: Value = getProp(data, field.keyPath);
        const stateId = buildFieldValidationStateId(field.id);

        const fieldNextSyncValidationState = buildCompleteSyncValidationResults(
          field,
          value,
          data,
          propsLevelStatuses,
          layerId,
        );

        // Don't perform async validation if:
        //   - there is no async validator
        //   - value is empty (no reason to validate empty value on remote)
        //   - value is invalid localy (no reason to validate invalid value on remote)
        const isAsync =
          !!field.validateAsync
          && (!!value || value === 0)
          && fieldNextSyncValidationState.valid
        ;

        if (!isAsync) {
          return {
            nextSyncState: {
              ...nextSyncState,
              [stateId]: fieldNextSyncValidationState,
            },
            ongoingAsyncValidations,
          };
        }

        const asyncStrategy =
          field.asyncStrategy
          || propsLevelAsyncStrategy
          || AsyncStrategy.DEFAULT
        ;

        // If asyncStrategy is ON_CHANGE,
        // then validator on normalized field is debounced.
        // We'll use original one.
        const asyncValidator =
          asyncStrategy === AsyncStrategy.ON_CHANGE
          ? getProp(fields, field.keyPath).validateAsync
          : field.validateAsync
        ;

        return {
          nextSyncState: {
            ...nextSyncState,
            [stateId]: buildIntermediateAsyncValidationResults(),
          },
          ongoingAsyncValidations: {
            ...ongoingAsyncValidations,
            // $FlowFixMe: Not sure how to assure flow that it's not debounced validator
            [stateId]: asyncValidator(value).then(results => ({
              resolution: buildCompleteAsyncValidationResults(
                field.id,
                results,
                propsLevelStatuses,
                layerId,
              ),
              forValue: value,
            })),
          },
        };
      }, origin)
  );
}


/**
 * @desc Performs fields validation on form submission.
 *       We don't want to perform async validations here
 *       as those will be performed on the server anyway - all within single request.
 *       However we should respect the current state of async validations.
 *       That being said, algoritm looks like this:
 *         - perform batch synchronous validation of all fields
 *         - resolve merge conflicts w/ existing state using the following regulations:
 *           - no current state -> just merge-in next one
 *           - current failure & next failure -> take next one
 *           - current success & next failure -> take next one
 *           - current failure & next success -> current isAsync ? keep current : take next one
 *           - current success & next success -> current isAsync ? keep current : take next one
 *         - return next composite state + validity resolution
 *
 */
export function performOnSubmitValidation(
  data: Data,
  state: State,
  fields: NormalizedFields,
  statuses: ?Statuses,
  layerId: LayerId,
): OnSubmitValidationResults {
  const origin = { validationState: {}, isValid: true };

  return fields.reduce(({ validationState, isValid }, field) => {
    // $FlowIgnoreMe: We're making sure that value at keyPath is not an object on normalization
    const value: Value = getProp(data, field.keyPath);
    const fieldValidationStateId = buildFieldValidationStateId(field.id);

    const fieldCurrentValidationState = state[fieldValidationStateId];
    const fieldNextSyncValidationState = buildCompleteSyncValidationResults(
      field,
      value,
      data,
      statuses,
      layerId,
    );

    const fieldNextValidationState =
      fieldCurrentValidationState
      && fieldNextSyncValidationState.valid
      && fieldCurrentValidationState.isAsync
      ? fieldCurrentValidationState
      : fieldNextSyncValidationState
    ;

    return {
      isValid: !isValid ? isValid : !!fieldNextValidationState.valid,
      validationState: {
        ...validationState,
        [fieldValidationStateId]: fieldNextValidationState,
      },
    };
  }, origin);
}
