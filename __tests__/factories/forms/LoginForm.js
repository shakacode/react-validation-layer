/* @flow */
/* eslint-disable react/prop-types */

import React from 'react';
import classNames from 'classnames';
import { mount } from 'enzyme';

import type {
  Data,
  Fields,
  Strategy,
  PropsLevelDomHandlers,
} from '../../../src/types';

import { mockStrictLayerProps } from '../../helpers';

import * as emailField from '../fields/email';
import * as passwordField from '../fields/password';

import ValidationLayer from '../../../src';

const defaultData = { email: null, password: null };

const defaultFields = {
  email: emailField.validatePresenceAndShapeWithMessages({
    presence: 'Email is required',
    shape: 'Email is invalid',
  }),
  password: passwordField.validatePresenceAndLengthWithMessages({
    presence: 'Password is required',
    length: 'Password is too short',
  }),
};

type Props = {
  id?: string,
  data?: Data,
  fields?: Fields,
  strategy?: Strategy,
  handlers?: PropsLevelDomHandlers | void,
};

const LoginForm = ({
  strategy,
  id = 'loginForm',
  data = defaultData,
  fields = defaultFields,
  // $FlowIgnoreMe
  handlers = undefined,
}: Props) =>
  <ValidationLayer
    {...mockStrictLayerProps({ strategy, id, data, fields, handlers })}
  >
    {layer =>
      <form className="form" onSubmit={layer.handleSubmit}>
        <div
          className={classNames('email-wrapper', layer.getStatusFor('email'))}
        >
          <input
            type="text"
            className="email-input"
            {...layer.getPropsFor('email')}
          />
          {layer.getMessageFor('email') &&
            <span className="email-message">
              {layer.getMessageFor('email')}
            </span>}
        </div>
        <div
          className={classNames(
            'password-wrapper',
            layer.getStatusFor('password'),
          )}
        >
          <input
            type="text"
            className="password-input"
            {...layer.getPropsFor('password')}
          />
          {layer.getMessageFor('password') &&
            <span className="password-message">
              {layer.getMessageFor('password')}
            </span>}
        </div>
        <div className="submit-button-wrapper">
          <button {...layer.getSubmitButtonProps()} className="submit-button">
            Submit
          </button>
        </div>
      </form>}
  </ValidationLayer>;

/* eslint-disable new-cap */
export const mountLoginForm = (...args: Array<Props>): * =>
  mount(LoginForm(...args));
