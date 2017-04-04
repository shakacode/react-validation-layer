/* @flow */
/* eslint-disable no-use-before-define */

import React from 'react';

import ValidationLayer from '../ValidationLayer';
import LayerInterface from '../LayerInterface';


export type LayerId = string;

export type Props = {|
  id?: LayerId,
  data: Data,
  fields: Fields,
  strategy?: Strategy,
  asyncStrategy?: AsyncStrategy,
  debounceInterval?: number,
  statuses?: Statuses,
  handlers: PropsLevelDomHandlers,
  filter?: Filter,
  transformBeforeStore?: TransformBeforeStore,
  transformBeforeRender?: TransformBeforeRender,
  children?: (layer: LayerInterface) => React.Element<*>,
|};

export type LayerDomHandlersProps = {|
  layerId: LayerId,
  stateContainer: StateContainer,
  data: Data,
  filter?: Filter,
  transformBeforeStore?: TransformBeforeStore,
  handlers: PropsLevelDomHandlers,
  children?: (layer: LayerInterface) => React.Element<*>,
|};

export type Data = { [attr: string]: Value | Data };

export type PlainField = boolean;

// NOTE: Don't forget to update `NormalizedField` as well
export type Field = {|
  strategy?: Strategy,
  asyncStrategy?: AsyncStrategy,
  validate?: Validate,
  validateAsync?: ValidateAsync,
  debounceInterval?: number,
  linkedFields?: Array<KeyPath>,
  disabled?: boolean,
  filter?: Filter,
  transformBeforeStore?: TransformBeforeStore,
  transformBeforeRender?: TransformBeforeRender,
  handlers?: FieldLevelDomHandlers,
|};

export type NormalizedField = {|
  // Internal data
  id: FieldId,
  keyPath: Array<string>,

  // Public API
  strategy?: Strategy,
  asyncStrategy?: AsyncStrategy,
  validate?: Validate,
  validateAsync?: ValidateAsync | DebouncedValidateAsync,
  debounceInterval?: number,
  linkedFields?: Array<KeyPath>,
  disabled?: boolean,
  filter?: Filter,
  transformBeforeStore?: TransformBeforeStore,
  transformBeforeRender?: TransformBeforeRender,
  handlers?: FieldLevelDomHandlers,
|};

export type NormalizedFields = Array<NormalizedField>;

// Flow can't handle such recursivity
// export type Fields = { [attr: string]: PlainField | Field | Fields };
export type Fields = { [attr: string]: * };

export type DomData = {|
  fieldId: FieldId,
  attr: string,
  keyPath: Array<string>,
  value: DomValue | Value, // Value is possible b/c it can be passed from custom handlers
  checked?: boolean,
  data: Data,
  event?: SyntheticInputEvent,
|};

// Flow can't handle such recursivity
// export type ExternalErrors = { [attr: string]: string | ExternalErrors };
export type ExternalErrors = { [attr: string]: * };
export type NormalizedExternalError = {|
  fieldId: FieldId,
  message: string | Array<string>,
|};
export type NormalizedExternalErrors = Array<NormalizedExternalError>;

export type OnChange = (data: DomData) => void;
export type OnBlur = (data: DomData) => void;
export type OnSubmit = (callbacks: {
  onSuccess: () => void,
  onFailure: (errors: ExternalErrors) => void,
}) => void;

export type FieldLevelDomHandlers = {|
  onChange?: OnChange,
  onBlur?: OnBlur,
|};

export type PropsLevelDomHandlers = {|
  onChange?: OnChange,
  onBlur?: OnBlur,
  onSubmit: OnSubmit,
|};

export type ValueHandler = ?Filter | ?TransformBeforeStore | ?TransformBeforeRender;

export type Strategy =
  | 'onMount'
  | 'onFirstChange'
  | 'onFirstBlur'
  | 'onFirstSuccess'
  | 'onFirstSuccessOrFirstBlur'
  | 'onFirstSubmit'
;

export type AsyncStrategy =
  | 'onBlur'
  | 'onChange'
;

export type Statuses = {|
  success?: string,
  failure?: string,
|};

export type DefaultStatus = 'success' | 'failure';

export type Value = ?string | ?number | ?boolean;
export type DomValue = string | void;
export type EnumerableValue = ?string | ?number;

export type ValidationResults = boolean | NormalizedValidationResults;

export type NormalizedValidationResults = {|
  valid: boolean | null,
  message?: string | null,
  status?: string | null,
|};

export type IntermediateAsyncValidationResults = {|
  valid: null,
  status: null,
  message: null,
  isProcessing: boolean,
|};

export type NormalizedAsyncValidationResults = {|
  valid: boolean,
  message?: string,
  status?: string,
  isAsync: boolean,
|};

export type InsuredAsyncValidationResults = {|
  resolution: NormalizedAsyncValidationResults,
  forValue: Value,
|};

export type EmptyValidationResults = {|
  valid: null,
  message: null,
  status: null,
|};

export type OnSubmitValidationResults = {|
  validationState: FieldsValidationState,
  isValid: boolean,
|};

export type SyncValidationResults = NormalizedValidationResults | EmptyValidationResults | null;
export type AsyncValidationResults = Promise<InsuredAsyncValidationResults>;
export type CompositeValidationResults =
  | SyncValidationResults
  | AsyncValidationResults
  | DebounceStatusReport
;
export type OngoingAsyncValidations = {
  [stateKey: FieldValidationStateId]: AsyncValidationResults,
};
export type FieldsValidationResults = {|
  nextSyncState: State,
  ongoingAsyncValidations: OngoingAsyncValidations,
|};

export type Validate = (value: Value, data: Data) => ValidationResults;
export type ValidateAsync = (value: Value) => Promise<ValidationResults>;
export type DebouncedValidateAsync = (
  fieldId: FieldId,
  value: Value,
  stateContainer: StateContainer,
) => DebounceStatusReport;

// Filter & TransformBeforeStore might accept Value,
// b/c non-string values can be passed from custom handlers
export type Filter = (value: DomValue | Value, data: Data) => boolean;
export type TransformBeforeStore = (value: DomValue | Value, data: Data) => Value;
export type TransformBeforeRender = (value: Value, data: Data) => DomValue;

export type StateContainer = ValidationLayer;

export type FieldId = string;                // user.email
export type FieldDomId = string;             // loginForm___user___email
export type FieldPropsStateId = string;      // fieldPropsState---user.email
export type FieldValidationStateId = string; // fieldValidationState---user.email

export type FieldPropsStateIdPrefix = 'fieldPropsState';
export type FieldValidationStateIdPrefix = 'fieldValidationState';

export type State = {
  [key: FieldPropsStateId | FieldValidationStateId]: (
      FieldBaseDomProps
    | NormalizedValidationResults
    | NormalizedAsyncValidationResults
    | IntermediateAsyncValidationResults
    | ValidationStateWithExternalErrors
  ),
};

export type FieldsPropsState = {
  [stateId: FieldPropsStateId]: FieldBaseDomProps,
};

export type FieldsValidationState = {
  [stateId: FieldValidationStateId]: (
    NormalizedValidationResults | IntermediateAsyncValidationResults
  ),
};

export type ValidationStateWithExternalErrors = {
  [stateId: FieldValidationStateId]: {|
    valid: boolean,
    status: string,
    message: string | Array<string>,
    isAsync: boolean,
  |},
};

export type ParsedFieldStateId = {|
  // Flow doesn't understand enum type on string splitting
  // dataType: FieldPropsStateIdPrefix | FieldValidationStateIdPrefix,
  dataType: string,
  fieldId: FieldId,
|};

export type KeyPath = string | Array<string>;

export type LayerField = {|
  props: FieldBaseDomProps,
  resolution: NormalizedValidationResults | IntermediateAsyncValidationResults,
|};

export type LayerHandleChange = (
  fieldId: FieldId,
  value: Value,
) => void;
export type LayerHandleBlur = (
  fieldId: FieldId,
  value: Value,
  event: SyntheticInputEvent,
) => void;
export type LayerHandleSubmit = (event: SyntheticInputEvent) => void;

export type LayerHandlers = {|
  handleDomBlur: DomHandler,
  handleDomChange: DomHandler,
  handleCustomBlur: LayerHandleBlur,
  handleCustomChange: LayerHandleChange,
  handleSubmit: LayerHandleSubmit,
|};

// NOTE: Don't forget to update `FieldDomProps` & `FieldPropsWithChecked` as well
// Duping until object type spread is available
// More details: https://github.com/facebook/flow/issues/2626#issuecomment-267449133
export type FieldBaseDomProps = {|
  'data-fieldid': FieldId,
  id: FieldDomId,
  name: FieldId,
  value: DomValue,
  disabled: boolean,
|};

export type FieldDomProps = {|
  'data-fieldid': FieldId,
  id: FieldDomId,
  name: FieldId,
  value: DomValue,
  disabled: boolean,

  // handlers
  onChange: DomHandler,
  onBlur: DomHandler,
|};

export type FieldDomPropsWithChecked = {|
  // base dom props
  'data-fieldid': FieldId,
  id: FieldDomId,
  name: FieldId,
  value: DomValue,
  disabled: boolean,

  // checked
  checked: boolean,

  // handlers
  onChange: DomHandler,
  onBlur: DomHandler,
|};

export type SubmitButtonDomProps = {|
  type: 'submit',
  disabled: boolean,
|};

export type DomHandler = (event: SyntheticInputEvent) => void;

export type FieldFlags = { [fieldId: FieldId]: boolean };

export type DebounceStatus = 'initialized' | 'debounced';
export type DebounceStatusReport = {| status: DebounceStatus |};

export type StrategyHandler = (
  field: NormalizedField,
  value: ?Value,
  data: Data,
  event: ?SyntheticInputEvent,
  stateContainer: StateContainer,
) => NormalizedValidationResults | EmptyValidationResults;

export type AsyncStrategyHandler = (
  field: NormalizedField,
  value: ?Value,
  stateContainer: StateContainer,
) => AsyncValidationResults | null;

export type AsyncDebouncedStrategyHandler = (
  field: NormalizedField,
  value: ?Value,
  stateContainer: StateContainer,
) => DebounceStatusReport;

export type StrategyHandlers = { [strategy: Strategy]: StrategyHandler };
export type AsyncStrategyHandlers = {
  [asyncStrategy: AsyncStrategy]: AsyncStrategyHandler | AsyncDebouncedStrategyHandler,
};

// Enums
export type StrategyEnum = {|
  DEFAULT: 'onFirstSuccessOrFirstBlur',
  ON_MOUNT: 'onMount',
  ON_FIRST_CHANGE: 'onFirstChange',
  ON_FIRST_BLUR: 'onFirstBlur',
  ON_FIRST_SUCCESS: 'onFirstSuccess',
  ON_FIRST_SUCCESS_OR_FIRST_BLUR: 'onFirstSuccessOrFirstBlur',
  ON_FIRST_SUBMIT: 'onFirstSubmit',
|};

export type AsyncStrategyEnum = {|
  DEFAULT: 'onChange',
  ON_BLUR: 'onBlur',
  ON_CHANGE: 'onChange',
|};

export type DefaultStatusEnum = {|
  SUCCESS: 'success',
  FAILURE: 'failure',
|};

export type ConstantEnum = {|
  DEFAULT_LAYER_ID: 'form',
  DEFAULT_DEBOUNCE_INTERVAL: number,
  FIELD_ID_DOM_DATA_ATTRIBUTE: 'data-fieldid',
  FIELD_ID_DELIMITER: '.',
  FIELD_ID_COLLECTION_INDEX_DELIMITER: '/',
  FIELD_STATE_ID_DELIMITER: '---',
  FIELD_DOM_ID_DELIMITER: '___',
  FIELD_PROPS_STATE_ID_PREFIX: 'fieldPropsState',
  FIELD_VALIDATION_STATE_ID_PREFIX: 'fieldValidationState',
  COLLECTION_DATA_TYPE: 'collection',
|};

export type DebounceStatusEnum = {|
  INITIALIZED: 'initialized',
  DEBOUNCED: 'debounced',
|};
