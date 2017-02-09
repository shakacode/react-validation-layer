/* @flow */
/* eslint-disable max-len */

import { mountPasswordForm } from '../../factories/forms/PasswordForm';

describe('case.emitConsistentValidationResults', () => {
  it('emits consistent results onFirstChange when invalid state reported as object & valid as boolean', () => {
    const Form = mountPasswordForm({
      strategy: 'onFirstChange',
      data: { password: null },
      fields: {
        password: {
          validate: password => (
            password.length < 4
            ? { valid: false, message: 'Password is too short' }
            : true
          ),
        },
      },
    });

    // No results are shown on mount
    expect(Form.find('.password-message').length).toBe(0);
    expect(Form.find('.password-wrapper').hasClass('failure')).toBe(false);
    expect(Form.find('.password-wrapper').hasClass('success')).toBe(false);
    expect(Form.find('.password-validity').text()).toBe('none');

    // User types invalid `password`
    Form.setProps({ data: { password: '123' } });
    Form.find('.password-input').simulate('change');

    // Error message for `password` is shown
    expect(Form.find('.password-message').text()).toBe('Password is too short');
    expect(Form.find('.password-wrapper').hasClass('failure')).toBe(true);
    expect(Form.find('.password-wrapper').hasClass('success')).toBe(false);
    expect(Form.find('.password-validity').text()).toBe('invalid');

    // User types valid `password`
    Form.setProps({ data: { password: '1234' } });
    Form.find('.password-input').simulate('change');

    // Consistent success for `password`
    expect(Form.find('.password-message').length).toBe(0);
    expect(Form.find('.password-wrapper').hasClass('failure')).toBe(false);
    expect(Form.find('.password-wrapper').hasClass('success')).toBe(true);
    expect(Form.find('.password-validity').text()).toBe('valid');
  });


  it('emits consistent results onFirstSuccess when invalid state reported as object & valid as boolean', () => {
    const Form = mountPasswordForm({
      strategy: 'onFirstSuccess',
      data: { password: null },
      fields: {
        password: {
          validate: password => (
            password.length < 4
            ? { valid: false, message: 'Password is too short' }
            : true
          ),
        },
      },
    });

    // No results are shown on mount
    expect(Form.find('.password-message').length).toBe(0);
    expect(Form.find('.password-wrapper').hasClass('failure')).toBe(false);
    expect(Form.find('.password-wrapper').hasClass('success')).toBe(false);
    expect(Form.find('.password-validity').text()).toBe('none');

    // User types invalid `password`
    Form.setProps({ data: { password: '123' } });
    Form.find('.password-input').simulate('change');

    // Still no results are shown
    expect(Form.find('.password-message').length).toBe(0);
    expect(Form.find('.password-wrapper').hasClass('failure')).toBe(false);
    expect(Form.find('.password-wrapper').hasClass('success')).toBe(false);
    expect(Form.find('.password-validity').text()).toBe('none');

    // User types valid `password`
    Form.setProps({ data: { password: '1234' } });
    Form.find('.password-input').simulate('change');

    // Consistent success for `password`
    expect(Form.find('.password-message').length).toBe(0);
    expect(Form.find('.password-wrapper').hasClass('failure')).toBe(false);
    expect(Form.find('.password-wrapper').hasClass('success')).toBe(true);
    expect(Form.find('.password-validity').text()).toBe('valid');

    // User types invalid `password`
    Form.setProps({ data: { password: '123' } });
    Form.find('.password-input').simulate('change');

    // Consistent failure for `password`
    expect(Form.find('.password-message').text()).toBe('Password is too short');
    expect(Form.find('.password-wrapper').hasClass('failure')).toBe(true);
    expect(Form.find('.password-wrapper').hasClass('success')).toBe(false);
    expect(Form.find('.password-validity').text()).toBe('invalid');
  });
});
