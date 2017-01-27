/* @flow */
/* eslint-disable max-len */

import { mountLoginForm } from '../../factories/forms/LoginForm';

describe('case.markAllFieldsAsTouchedAfterFirstSubmit', () => {
  it('marks all fields as touched on submission', () => {
    const Form = mountLoginForm({
      strategy: 'instantTouchedOnly',
      data: {
        email: null,
        password: 'same-as-email',
      },
      fields: {
        email: {
          validate(value) {
            if (!value) {
              return {
                valid: false,
                message: 'Email is required',
              };
            }
            return true;
          },
        },
        password: {
          validate(value, props) {
            const { data } = props;
            if (value === data.email) {
              return {
                valid: false,
                message: 'Password can not be the same as email',
              };
            }
            return true;
          },
        },
      },
    });

    Form.find('.form').simulate('submit');

    // Error for `email` is shown
    expect(Form.find('.email-message').text()).toBe('Email is required');
    expect(Form.find('.email-wrapper').hasClass('failure')).toBe(true);
    expect(Form.find('.email-wrapper').hasClass('success')).toBe(false);

    // Success for `password` is shown
    expect(Form.find('.password-message').length).toBe(0);
    expect(Form.find('.password-wrapper').hasClass('failure')).toBe(false);
    expect(Form.find('.password-wrapper').hasClass('success')).toBe(true);

    Form.find('.email-input').simulate('change');
    Form.setProps({ data: { email: 'same-as-email', password: 'same-as-email' } });

    // Error for `password` is shown
    expect(Form.find('.password-message').text()).toBe('Password can not be the same as email');
    expect(Form.find('.password-wrapper').hasClass('failure')).toBe(true);
    expect(Form.find('.password-wrapper').hasClass('success')).toBe(false);
  });
});
