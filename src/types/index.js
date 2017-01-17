/* @flow */
/* eslint-disable no-use-before-define */

import React from 'react';

import Layer from '../containers/Layer';
import StateContainer from '../containers/StateContainer';


// Public API
export type LayerId = string;

export type Props = {
  id: LayerId,
  data: Data,
  fields: Fields,
  statuses?: Statuses,
  handlers: PropsLevelHandlers,
  strategy?: Strategy,
  filter?: Filter,
  transformBeforeStore?: TransformBeforeStore,
  transformBeforeRender?: TransformBeforeRender,
  children?: (layer: Layer) => React.Element<*>,
};

export type Data = { [attr: string]: Value | Data };

export type PlainField = boolean;

export type Field = {|
  strategy?: Strategy,
  validate?: Validate,
  validateAsync?: ValidateAsync,
  filter?: Filter,
  transformBeforeStore?: TransformBeforeStore,
  transformBeforeRender?: TransformBeforeRender,
  disabled?: boolean,
  handlers?: FieldLevelHandlers,
|};

export type NormalizedField = {
  // Internal data
  id: FieldId,
  keyPath: Array<string>,

  // Public API
  strategy?: Strategy,
  validate?: Validate,
  validateAsync?: ValidateAsync,
  filter?: Filter,
  transformBeforeStore?: TransformBeforeStore,
  transformBeforeRender?: TransformBeforeRender,
  disabled?: boolean,
  handlers?: FieldLevelHandlers,
};

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
  event?: SyntheticInputEvent,
  originalData: Data,
|};

export type OnChange = (data: DomData) => void;
export type OnBlur = (data: DomData) => void;
export type OnSubmit = (callbacks: {
  onSuccess: () => void,
  onFailure: () => void, // TODO: Add ability to pass external errors here
}) => void;

export type FieldLevelHandlers = {|
  onChange?: OnChange,
  onBlur?: OnBlur,
|};

export type PropsLevelHandlers = {|
  onChange?: OnChange,
  onBlur?: OnBlur,
  onSubmit: OnSubmit,
|};

export type Strategy =
  | 'instant'
  | 'instantTouchedOnly'
  | 'onFirstChange'
  | 'onFirstBlur'
  | 'onFirstSuccess'
  | 'onFirstSuccessOrFirstBlur'
  | 'onFirstSubmit'
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

export type EmptyValidationResults = {|
  valid: null,
  message: null,
  status: null,
|};

export type Validate = (value: Value, props?: Props) => boolean | ValidationResults;
export type ValidateAsync = (value: Value, props: Props) => Promise<*>;

// Filter & TransformBeforeStore might accept Value,
// b/c non-string values can be passed from custom handlers
export type Filter = (value: DomValue | Value, props: Props) => boolean;
export type TransformBeforeStore = (value: DomValue | Value, props: Props) => Value;
export type TransformBeforeRender = (value: Value, props: Props) => DomValue;


// Internal
export type FieldId = string;                // user.email
export type FieldDomId = string;             // loginForm___user___email
export type FieldPropsStateId = string;      // fieldPropsState---user.email
export type FieldValidationStateId = string; // fieldValidationState---user.email

export type FieldPropsStateIdPrefix = 'fieldPropsState';
export type FieldValidationStateIdPrefix = 'fieldValidationState';

export type State = {
  [key: FieldPropsStateId | FieldValidationStateId]: FieldBaseProps | ValidationResults,
};

export type FieldsPropsState = {
  [stateId: FieldPropsStateId]: FieldBaseProps,
};

export type FieldsValidationState = {
  [stateId: FieldValidationStateId]: NormalizedValidationResults,
};

export type ParsedFieldStateId = {|
  // Flow doesn't understand enum type on string splitting
  // dataType: FieldPropsStateIdPrefix | FieldValidationStateIdPrefix,
  dataType: string,
  fieldId: FieldId,
|};

export type KeyPath = string | Array<string>;

export type LayerField = {|
  props: FieldBaseProps,
  resolution: NormalizedValidationResults,
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
  handleChange: LayerHandleChange,
  handleBlur: LayerHandleBlur,
  handleSubmit: LayerHandleSubmit,
|};

export type FieldBaseProps = {|
  'data-fieldid': FieldId,
  id: FieldDomId,
  name: FieldId,
  value: DomValue,
  disabled: boolean,
  onChange: (event: SyntheticInputEvent) => void,
  onBlur: (event: SyntheticInputEvent) => void,
|};

// Duping FieldBaseProps until object type spread is available
// More details: https://github.com/facebook/flow/issues/2626#issuecomment-267449133
export type FieldPropsWithChecked = {|
  // base props
  'data-fieldid': FieldId,
  id: FieldDomId,
  name: FieldId,
  value: DomValue,
  disabled: boolean,
  onChange: (event: SyntheticInputEvent) => void,
  onBlur: (event: SyntheticInputEvent) => void,

  // checked
  checked: boolean,
|};

export type FieldFlags = { [fieldId: FieldId]: boolean };

export type StrategyHandler = (
  props: Props,
  field: NormalizedField,
  data: DomData,
  stateContainer: StateContainer,
) => NormalizedValidationResults | EmptyValidationResults;

export type StrategyHandlers = { [strategy: Strategy]: StrategyHandler };

export type StrategyEnum = { [key: string]: Strategy };
export type DefaultStatusEnum = { [key: string]: DefaultStatus };
export type ConstantEnum = { [key: string]: string };
