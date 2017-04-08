/* @flow */
/* eslint-disable react/prop-types */

import React from 'react';
import classNames from 'classnames';
import { mount } from 'enzyme';

import type {
  Data,
  Fields,
  Strategy,
  AsyncStrategy,
  PropsLevelDomHandlers,
} from '../../../src/types';

import { mockStrictLayerProps } from '../../helpers';

import ValidationLayer from '../../../src';


const defaultData = {
  email: null,
  password: null,
  passwordConfirmation: null,
};

type Props = {
  id?: string,
  data?: Data,
  fields: Fields,
  strategy?: Strategy,
  asyncStrategy?: AsyncStrategy,
  debounceInterval?: number,
  handlers?: PropsLevelDomHandlers | void,
};

const SignupForm = ({
  fields,
  strategy,
  asyncStrategy,
  debounceInterval,
  id = 'signupForm',
  data = defaultData,
  // $FlowIgnoreMe
  handlers = undefined,
  ...otherProps
}: Props) => (
  <ValidationLayer
    {...mockStrictLayerProps({
      strategy,
      asyncStrategy,
      debounceInterval,
      id,
      data,
      fields,
      handlers,
      ...otherProps,
    })}
  >
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
          {
            layer.getAsyncStatusFor('email') &&
            <span className="email-message">
              Checking...
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
        <div
          className={classNames(
            'password-confirmation-wrapper',
            layer.getStatusFor('passwordConfirmation'),
          )}
        >
          <input
            type="text"
            className="password-confirmation-input"
            {...layer.getPropsFor('passwordConfirmation')}
          />
          {
            layer.getMessageFor('passwordConfirmation') &&
            <span className="password-confirmation-message">
              {layer.getMessageFor('passwordConfirmation')}
            </span>
          }
        </div>
        <div className="submit-button-wrapper">
          <button
            {...layer.getSubmitButtonProps()}
            className="submit-button"
          >
            Submit
          </button>
        </div>
      </form>
    )}
  </ValidationLayer>
);

/* eslint-disable new-cap */
export const mountSignupForm = (...args: Array<Props>): * => mount(SignupForm(...args));
