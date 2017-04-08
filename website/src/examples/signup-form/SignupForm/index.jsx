import React from 'react';
import classNames from 'classnames';

import email from './fields/email';
import password from './fields/password';
import passwordConfirmation from './fields/passwordConfirmation';

import ValidationLayer from '../../../../../lib/react-validation-layer.cjs';

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
        <div className="form-bg">
          <div className="form-messages-area-bg form-messages-area-bg-lg" />
          <div className="form-content">
            <h2 className="push-lg">
              Signup
            </h2>

            {/* Field: `email` */}
            <div
              className={classNames(
                'form-field-wrapper',
                layer.getStatusFor('email'),
              )}
            >
              <label
                htmlFor={layer.getDomIdFor('email')}
                className="label-lg"
              >
                Email
              </label>
              <input
                type="text"
                {...layer.getPropsFor('email')}
              />
              {
                layer.getAsyncStatusFor('email') &&
                <div className="form-message">
                  Checking...
                </div>
              }
              {
                layer.getMessageFor('email') &&
                <div className="form-message">
                  {layer.getMessageFor('email')}
                </div>
              }
            </div>
            <div className="note push-lg">
              Hint: try `test@taken.email`
            </div>

            {/* Field: `password` */}
            <div
              className={classNames(
                'form-field-wrapper',
                layer.getStatusFor('password'),
              )}
            >
              <label
                htmlFor={layer.getDomIdFor('password')}
                className="label-lg"
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

            {/* Field: `passwordConfirmation` */}
            <div
              className={classNames(
                'form-field-wrapper',
                layer.getStatusFor('passwordConfirmation'),
              )}
            >
              <label
                htmlFor={layer.getDomIdFor('passwordConfirmation')}
                className="label-lg"
              >
                Confirm Password
              </label>
              <input
                type="password"
                {...layer.getPropsFor('passwordConfirmation')}
              />
              {
                layer.getMessageFor('passwordConfirmation') &&
                <div className="form-message">
                  {layer.getMessageFor('passwordConfirmation')}
                </div>
              }
            </div>

            {/* Submit button */}
            <div className="form-field-wrapper">
              <button
                className="push-lg"
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

export default SignupForm;
