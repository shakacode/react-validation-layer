import React from 'react';
import classNames from 'classnames';

import email from './fields/email';
import password from './fields/password';

import ValidationLayer from '../../../../../lib';

const LoginForm = ({ loginData, updateFormState }) => (
  <ValidationLayer
    feedbackStrategy="onSuccessOrFirstBlur"
    dataKey="data"
    data={loginData}
    fields={[email, password]}
    handlers={{
      onChange: updateFormState,
      onSubmit: v => v,
    }}
  >
    {layer => (
      <form>
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
            type="text"
          />
          {
            layer.getMessageFor('password') &&
            <div className="form-message">
              {layer.getMessageFor('password')}
            </div>
          }
        </div>
      </form>
    )}
  </ValidationLayer>
);

export default LoginForm;
