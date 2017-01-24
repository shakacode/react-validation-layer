/* @flow */

import type { Props, NormalizedField, PropsLevelHandlers } from '../../src/types';
import type { TestProps, TestValidity, TestPropsLevelHandlers } from '../types';

import { buildFieldId } from '../../src/modules/ids';
import normalizeFieldsFromProps from '../../src/modules/normalizeFieldsFromProps';


export const dummyFunction = (): void => undefined;


/* eslint-disable no-unused-vars */
export const mockOnChangeHandler = () => (data: {}): void => undefined;
export const mockOnBlurHandler = () => (): void => undefined;
export const mockOnSubmitHandler = () => (callbacks: {
  onSuccess: () => void,
  onFailure: () => void,
}): void => undefined;
/* eslint-enable no-unused-vars */


export const mockPropsLevelHandlers =
  // $FlowIssue: https://github.com/facebook/flow/issues/2977
  (handlers?: TestPropsLevelHandlers = {}): PropsLevelHandlers => ({
    onChange: mockOnChangeHandler(),
    onSubmit: mockOnSubmitHandler(),
    ...handlers,
  });


export const mockNormalizedField = (
  props: { keyPath?: Array<string> },
): NormalizedField => {
  const keyPath = props.keyPath || ['dummy'];

  return {
    id: buildFieldId(keyPath),
    keyPath,
    ...props,
  };
};


export const mockDummyLayerProps = (props: TestProps): Props => ({
  id: 'dummyId',
  data: {},
  fields: {},
  handlers: mockPropsLevelHandlers(),
  ...props,
});


export const mockStrictLayerProps = (props: TestProps): Props => {
  if (!props.data) throw new Error('`data` is required');
  if (!props.fields) throw new Error('`fields` are required');

  if (
    !props.strategy &&
    !normalizeFieldsFromProps(props.fields, props.data).every(field => field.strategy)
  ) {
    throw new Error('`strategy` is required');
  }

  const defaultProps = { handlers: mockPropsLevelHandlers() };

  return { ...defaultProps, ...props };
};


export const printValidity = (valid: boolean | void): TestValidity => {
  switch (valid) {
    case true: return 'valid';
    case false: return 'invalid';
    default: return 'none';
  }
};
