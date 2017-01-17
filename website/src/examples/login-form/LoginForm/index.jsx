import React from 'react';
import classNames from 'classnames';

import email from './fields/email';
import password from './fields/password';

import ValidationLayer from '../../../../../lib';

const LoginForm = ({ loginData, updateFormState, submitForm }) => (
  <ValidationLayer
    id="loginForm"
    data={loginData}
    fields={{ email, password }}
    strategy="onFirstSuccessOrFirstBlur"
    handlers={{
      onChange: updateFormState,
      onSubmit: submitForm,
    }}
  >
    {layer => (
      <form onSubmit={layer.handleSubmit}>
        <div className={classNames('form-field-wrapper', layer.getStatusFor('email'))}>
          <label htmlFor={layer.getDomIdFor('email')}>
            Email
          </label>
          <input
            {...layer.getPropsFor('email')}
            type="text"
          />
          {
            layer.getMessageFor('email') &&
            <div className="form-message">
              {layer.getMessageFor('email')}
            </div>
          }
        </div>
        <div className={classNames('form-field-wrapper', layer.getStatusFor('password'))}>
          <label htmlFor={layer.getDomIdFor('password')}>
            Password
          </label>
          <input
            {...layer.getPropsFor('password')}
            type="password"
          />
          {
            layer.getMessageFor('password') &&
            <div className="form-message">
              {layer.getMessageFor('password')}
            </div>
          }
        </div>
        <div className="form-field-wrapper">
          <div className="label-paceholder" />
          <button>Submit</button>
        </div>
      </form>
    )}
  </ValidationLayer>
);

export default LoginForm;
