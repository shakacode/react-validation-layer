/* eslint-disable react/prop-types */

import React from 'react';
import classNames from 'classnames';
import { mount } from 'enzyme';

import { mockLayerProps } from '../../helpers';

import * as emailField from '../fields/email';
import * as passwordField from '../fields/password';

import ValidationLayer from '../../../src';


const defaultData = { email: null, password: null };

const defaultFields = [
  emailField.validatePresenceAndShapeWithMessages({
    presence: 'Email is required',
    shape: 'Email is invalid',
  }),
  passwordField.validatePresenceAndLengthWithMessages({
    presence: 'Password is required',
    length: 'Password is too short',
  }),
];

const LoginForm = ({
  feedbackStrategy,
  data = defaultData,
  fields = defaultFields,
}) => (
  <ValidationLayer {...mockLayerProps({ feedbackStrategy, data, fields })}>
    {layer => (
      <form className="form" onSubmit={layer.handleSubmit}>
        <div className={classNames('email-wrapper', layer.getStatusFor('email'))}>
          <input
            type="text"
            className="email-input"
            {...layer.getPropsFor('email')}
          />
          {
            layer.getMessageFor('email') &&
            <span className="email-message">
              {layer.getMessageFor('email')}
            </span>
          }
        </div>
        <div className={classNames('password-wrapper', layer.getStatusFor('password'))}>
          <input
            type="text"
            className="password-input"
            {...layer.getPropsFor('password')}
          />
          {
            layer.getMessageFor('password') &&
            <span className="password-message">
              {layer.getMessageFor('password')}
            </span>
          }
        </div>
      </form>
    )}
  </ValidationLayer>
);

/* eslint-disable new-cap */
export const mountLoginForm = (...args) => mount(LoginForm(...args));
