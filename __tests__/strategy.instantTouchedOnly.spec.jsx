import React from 'react';
import classNames from 'classnames';
import { mount } from 'enzyme';

import { mockLayerProps } from './utils';

import ValidationLayer from '../src';


describe('strategy.instantTouchedOnly', () => {
  it('emits results on blur', () => {
    const layerProps = mockLayerProps({
      feedbackStrategy: 'instantTouchedOnly',
      data: { email: '', password: '' },
      fields: [
        {
          attr: 'email',
          validate: v => !!v || { valid: false, message: 'Email is required' },
        },
        {
          attr: 'password',
          validate: v => !!v || { valid: false, message: 'Password is required' },
        },
      ],
    });

    const Form = mount(
      <ValidationLayer {...layerProps}>
        {layer => (
          <form>
            <input
              type="text"
              className={classNames('email-input', layer.getStatusFor('email'))}
              {...layer.getPropsFor('email')}
            />
            {
              layer.getMessageFor('email') &&
              <span className="email-error">
                {layer.getMessageFor('email')}
              </span>
            }
            <input
              type="text"
              className={classNames('password-input', layer.getStatusFor('password'))}
              {...layer.getPropsFor('password')}
            />
            {
              layer.getMessageFor('password') &&
              <span className="password-error">
                {layer.getMessageFor('password')}
              </span>
            }
          </form>
        )}
      </ValidationLayer>
    );

    // No errors are shown on mount
    expect(Form.find('.email-error').length).toBe(0);
    expect(Form.find('.email-input').hasClass('error')).toBe(false);
    expect(Form.find('.password-error').length).toBe(0);
    expect(Form.find('.password-input').hasClass('error')).toBe(false);

    // User blures from the `email` field
    Form.find('.email-input').simulate('blur');

    // Error for `email` is shown
    expect(Form.find('.email-error').text()).toBe('Email is required');
    expect(Form.find('.email-input').hasClass('error')).toBe(true);

    // Still no errors for `password`
    expect(Form.find('.password-error').length).toBe(0);
    expect(Form.find('.password-input').hasClass('error')).toBe(false);

    // User blures from the `password` field
    Form.find('.password-input').simulate('blur');

    // Error for `password` is shown
    expect(Form.find('.password-error').text()).toBe('Password is required');
    expect(Form.find('.password-input').hasClass('error')).toBe(true);

    // Error for `email` is still there
    expect(Form.find('.email-error').text()).toBe('Email is required');
    expect(Form.find('.email-input').hasClass('error')).toBe(true);
  });
});
