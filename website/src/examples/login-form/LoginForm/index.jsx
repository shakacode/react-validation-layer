import React from 'react';
import classNames from 'classnames';

import email from './fields/email';
import password from './fields/password';

import ValidationLayer from '../../../../../lib/react-validation-layer.cjs';

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
        <div className="form-bg">
          <div className="form-messages-area-bg form-messages-area-bg-md" />
          <div className="form-content">
            <h2 className="push-md">
              Login
            </h2>

            {/* Field: `email` */}
            <div className={classNames('form-field-wrapper', layer.getStatusFor('email'))}>
              <label
                htmlFor={layer.getDomIdFor('email')}
                className="label-md"
              >
                Email
              </label>
              <input
                type="text"
                {...layer.getPropsFor('email')}
              />
              {
                layer.getMessageFor('email') &&
                <div className="form-message">
                  {layer.getMessageFor('email')}
                </div>
              }
            </div>

            {/* Field: `password` */}
            <div className={classNames('form-field-wrapper', layer.getStatusFor('password'))}>
              <label
                htmlFor={layer.getDomIdFor('password')}
                className="label-md"
              >
                Password
              </label>
              <input
                type="password"
                {...layer.getPropsFor('password')}
              />
              {
                layer.getMessageFor('password') &&
                <div className="form-message">
                  {layer.getMessageFor('password')}
                </div>
              }
            </div>

            {/* Submit button */}
            <div className="form-field-wrapper">
              <div className="label-medium-paceholder" />
              <button
                className="push-md"
                {...layer.getSubmitButtonProps()}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </form>
    )}
  </ValidationLayer>
);

export default LoginForm;
