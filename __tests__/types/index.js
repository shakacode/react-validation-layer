/* @flow */

import React from 'react';

import type {
  Data,
  Fields,
  Statuses,
  Strategy,
  AsyncStrategy,
  OnChange,
  OnBlur,
  OnSubmit,
  PropsLevelDomHandlers,
} from '../../src/types';

import LayerInterface from '../../src/LayerInterface';


export type TestValidity = 'valid' | 'invalid' | 'none';

export type TestProps = {
  id?: string,
  data?: Data,
  fields?: Fields,
  statuses?: Statuses,
  handlers?: PropsLevelDomHandlers | void,
  strategy?: Strategy,
  asyncStrategy?: AsyncStrategy,
  debounceInterval?: number,
  children?: (layer: LayerInterface) => React.Element<*>,
};

export type TestPropsLevelDomHandlers = {|
  onChange?: OnChange,
  onBlur?: OnBlur,
  onSubmit?: OnSubmit,
|};
