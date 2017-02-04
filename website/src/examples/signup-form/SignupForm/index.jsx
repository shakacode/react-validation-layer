import React from 'react';
import classNames from 'classnames';

import email from './fields/email';
import password from './fields/password';
import passwordConfirmation from './fields/passwordConfirmation';

import ValidationLayer from '../../../../../lib';

const SignupForm = ({ signupData, updateFormState, submitForm }) => (
  <ValidationLayer
    id="signupForm"
    data={signupData}
    fields={{ email, password, passwordConfirmation }}
    strategy="onFirstSuccessOrFirstBlur"
    asyncStrategy="onChange"
    handlers={{
      onChange: updateFormState,
      onSubmit: submitForm,
    }}
  >
    {layer => (
      <form onSubmit={layer.handleSubmit}>
        <div
          className={classNames(
            'form-field-wrapper',
            layer.getStatusFor('email'),
          )}
        >
          <label htmlFor={layer.getDomIdFor('email')}>
            Email
          </label>
          <input
            {...layer.getPropsFor('email')}
            type="text"
          />
          {
            layer.getAsyncStatusFor('email') &&
            <div className="form-message">
              {layer.getAsyncStatusFor('email') && 'Checking...'}
            </div>
          }
          {
            layer.getMessageFor('email') &&
            <div className="form-message">
              {layer.getMessageFor('email')}
            </div>
          }
        </div>
        <div
          className={classNames(
            'form-field-wrapper',
            layer.getStatusFor('password'),
          )}
        >
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
        <div
          className={classNames(
            'form-field-wrapper',
            layer.getStatusFor('passwordConfirmation'),
          )}
        >
          <label htmlFor={layer.getDomIdFor('passwordConfirmation')}>
            Password Confirmation
          </label>
          <input
            {...layer.getPropsFor('passwordConfirmation')}
            type="password"
          />
          {
            layer.getMessageFor('passwordConfirmation') &&
            <div className="form-message">
              {layer.getMessageFor('passwordConfirmation')}
            </div>
          }
        </div>
        <div className="form-field-wrapper">
          <div className="label-paceholder" />
          <button>
            Submit
          </button>
        </div>
      </form>
    )}
  </ValidationLayer>
);

export default SignupForm;
