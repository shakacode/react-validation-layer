/* @flow */

import React from 'react';

import type {
  Data,
  Fields,
  Statuses,
  Strategy,
  OnChange,
  OnBlur,
  OnSubmit,
  PropsLevelHandlers,
} from '../../src/types';

import Layer from '../../src/containers/Layer';


export type TestValidity = 'valid' | 'invalid' | 'none';

export type TestProps = {
  id?: string,
  data?: Data,
  fields?: Fields,
  statuses?: Statuses,
  handlers?: PropsLevelHandlers,
  strategy?: Strategy,
  children?: (layer: Layer) => React.Element<*>,
};

export type TestPropsLevelHandlers = {|
  onChange?: OnChange,
  onBlur?: OnBlur,
  onSubmit?: OnSubmit,
|};
