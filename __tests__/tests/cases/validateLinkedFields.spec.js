/* @flow */
/* eslint-disable max-len */

import { Record } from 'immutable';

import { mountSignupForm } from '../../factories/forms/SignupForm';

describe('case.validateLinkedFields', () => {
  it('validates linked field of JS Object', () => {
    const Form = mountSignupForm({
      strategy: 'onFirstChange',
      data: {
        email: null,
        password: null,
        passwordConfirmation: null,
      },
      fields: {
        email: true,
        password: { linkedFields: ['passwordConfirmation'] },
        passwordConfirmation: {
          validate: (passwordConfirmation, data) => (
            passwordConfirmation !== data.password
            ? { valid: false, message: 'Password does not match' }
            : { valid: true, message: 'Nice!' }
          ),
        },
      },
    });


    // No results are shown on mount
    expect(Form.find('.password-confirmation-message').length).toBe(0);
    expect(Form.find('.password-confirmation-wrapper').hasClass('failure')).toBe(false);
    expect(Form.find('.password-confirmation-wrapper').hasClass('success')).toBe(false);

    // User types `password`
    Form.setProps({ data: { password: '123' } });
    Form.find('.password-input').simulate('change');

    // User types invalid `passwordConfirmation`
    Form.setProps({ data: { password: '123', passwordConfirmation: '12' } });
    Form.find('.password-confirmation-input').simulate('change');

    // Error message for `passwordConfirmation` is shown
    expect(Form.find('.password-confirmation-message').text()).toBe('Password does not match');
    expect(Form.find('.password-confirmation-wrapper').hasClass('failure')).toBe(true);
    expect(Form.find('.password-confirmation-wrapper').hasClass('success')).toBe(false);

    // User types valid `passwordConfirmation`
    Form.setProps({ data: { password: '123', passwordConfirmation: '123' } });
    Form.find('.password-confirmation-input').simulate('change');

    // Success for `passwordConfirmation`
    expect(Form.find('.password-confirmation-message').text()).toBe('Nice!');
    expect(Form.find('.password-confirmation-wrapper').hasClass('failure')).toBe(false);
    expect(Form.find('.password-confirmation-wrapper').hasClass('success')).toBe(true);

    // User changes `password`
    Form.setProps({ data: { password: '1234', passwordConfirmation: '123' } });
    Form.find('.password-input').simulate('change');

    // Error message for `passwordConfirmation` is shown
    expect(Form.find('.password-confirmation-message').text()).toBe('Password does not match');
    expect(Form.find('.password-confirmation-wrapper').hasClass('failure')).toBe(true);
    expect(Form.find('.password-confirmation-wrapper').hasClass('success')).toBe(false);
  });


  it('validates linked field of Immutable Record', () => {
    const Data = Record({
      email: null,
      password: null,
      passwordConfirmation: null,
    });

    const Form = mountSignupForm({
      strategy: 'onFirstChange',
      data: new Data(),
      fields: {
        email: true,
        password: { linkedFields: ['passwordConfirmation'] },
        passwordConfirmation: {
          validate: (passwordConfirmation, data) => (
            passwordConfirmation !== data.password
            ? { valid: false, message: 'Password does not match' }
            : { valid: true, message: 'Nice!' }
          ),
        },
      },
    });


    // No results are shown on mount
    expect(Form.find('.password-confirmation-message').length).toBe(0);
    expect(Form.find('.password-confirmation-wrapper').hasClass('failure')).toBe(false);
    expect(Form.find('.password-confirmation-wrapper').hasClass('success')).toBe(false);

    // User types `password`
    Form.setProps({ data: new Data({ password: '123' }) });
    Form.find('.password-input').simulate('change');

    // User types invalid `passwordConfirmation`
    Form.setProps({ data: new Data({ password: '123', passwordConfirmation: '12' }) });
    Form.find('.password-confirmation-input').simulate('change');

    // Error message for `passwordConfirmation` is shown
    expect(Form.find('.password-confirmation-message').text()).toBe('Password does not match');
    expect(Form.find('.password-confirmation-wrapper').hasClass('failure')).toBe(true);
    expect(Form.find('.password-confirmation-wrapper').hasClass('success')).toBe(false);

    // User types valid `passwordConfirmation`
    Form.setProps({ data: new Data({ password: '123', passwordConfirmation: '123' }) });
    Form.find('.password-confirmation-input').simulate('change');

    // Success for `passwordConfirmation`
    expect(Form.find('.password-confirmation-message').text()).toBe('Nice!');
    expect(Form.find('.password-confirmation-wrapper').hasClass('failure')).toBe(false);
    expect(Form.find('.password-confirmation-wrapper').hasClass('success')).toBe(true);

    // User changes `password`
    Form.setProps({ data: new Data({ password: '1234', passwordConfirmation: '123' }) });
    Form.find('.password-input').simulate('change');

    // Error message for `passwordConfirmation` is shown
    expect(Form.find('.password-confirmation-message').text()).toBe('Password does not match');
    expect(Form.find('.password-confirmation-wrapper').hasClass('failure')).toBe(true);
    expect(Form.find('.password-confirmation-wrapper').hasClass('success')).toBe(false);
  });
});
