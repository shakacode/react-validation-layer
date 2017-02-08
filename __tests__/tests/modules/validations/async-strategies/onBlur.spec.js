/* @flow */

import { validatePresenceAndShapeWithMessages } from '../../../../factories/fields/email';
import { mountSignupForm } from '../../../../factories/forms/SignupForm';

describe('modules.validation.asyncStrategy.onBlur()', () => {
  const WAIT_BEFORE_RESOLVED = 20;

  const mountForm = (strategy, validateAsync) => mountSignupForm({
    strategy,
    asyncStrategy: 'onBlur',
    fields: {
      email: {
        ...validatePresenceAndShapeWithMessages({
          presence: 'Email is required',
          shape: 'Email is invalid',
        }),
        validateAsync,
      },
      password: true,
    },
  });


  it('does not trigger async validation on change', () => {
    const validateAsync = jest.fn();

    const Form = mountForm('onFirstChange', validateAsync);

    // User changes the `email` field
    Form.find('.email-input').simulate('change');

    // validateAsync wasn't triggered
    expect(validateAsync).toHaveBeenCalledTimes(0);
  });


  it('does not trigger async validation if sync validation is failed with no value', () => {
    const validateAsync = jest.fn(() => new Promise(() => null));

    const Form = mountForm('onFirstChange', validateAsync);

    // User changes the `email` field
    Form.setProps({ data: { email: '' } });
    Form.find('.email-input').simulate('change');

    // Error for `email` is shown
    expect(Form.find('.email-message').text()).toBe('Email is required');
    expect(Form.find('.email-wrapper').hasClass('failure')).toBe(true);
    expect(Form.find('.email-wrapper').hasClass('success')).toBe(false);

    Form.find('.email-input').simulate('blur');

    // validateAsync wasn't triggered
    expect(validateAsync).toHaveBeenCalledTimes(0);
  });


  it('does not trigger async validation if sync validation is failed with invalid value', () => {
    const validateAsync = jest.fn(() => new Promise(() => null));

    const Form = mountForm('onFirstChange', validateAsync);

    // User changes the `email` field
    Form.setProps({ data: { email: 'invalid@email' } });
    Form.find('.email-input').simulate('change');

    // Error for `email` is shown
    expect(Form.find('.email-message').text()).toBe('Email is invalid');
    expect(Form.find('.email-wrapper').hasClass('failure')).toBe(true);
    expect(Form.find('.email-wrapper').hasClass('success')).toBe(false);

    Form.find('.email-input').simulate('blur');

    // validateAsync wasn't triggered
    expect(validateAsync).toHaveBeenCalledTimes(0);

    // Error for `email` is still there
    expect(Form.find('.email-message').text()).toBe('Email is invalid');
    expect(Form.find('.email-wrapper').hasClass('failure')).toBe(true);
    expect(Form.find('.email-wrapper').hasClass('success')).toBe(false);
  });


  it('triggers async validation on blur and it provides interm and final feedback', (done) => {
    const validateAsync = jest.fn(() => new Promise(resolve => {
      const results = { valid: true, message: 'Nice!' };
      setTimeout(() => resolve(results), WAIT_BEFORE_RESOLVED);
    }));

    const Form = mountForm('onFirstBlur', validateAsync);

    // User changes the `email` field
    Form.setProps({ data: { email: 'valid@email.com' } });
    Form.find('.email-input').simulate('change');

    // No results for `email`
    expect(Form.find('.email-message').length).toBe(0);
    expect(Form.find('.email-wrapper').hasClass('failure')).toBe(false);
    expect(Form.find('.email-wrapper').hasClass('success')).toBe(false);

    Form.find('.email-input').simulate('blur');

    // validateAsync is triggered, processing label is shown w/o validity status
    expect(validateAsync).toHaveBeenCalledTimes(1);
    expect(Form.find('.email-message').text()).toBe('Checking...');
    expect(Form.find('.email-wrapper').hasClass('failure')).toBe(false);
    expect(Form.find('.email-wrapper').hasClass('success')).toBe(false);

    // Waiting for async results...
    setTimeout(() => {
      try {
        // Success for `email`
        expect(Form.find('.email-message').text()).toBe('Nice!');
        expect(Form.find('.email-wrapper').hasClass('failure')).toBe(false);
        expect(Form.find('.email-wrapper').hasClass('success')).toBe(true);
        done();
      } catch (error) {
        done.fail(error);
      }
    }, WAIT_BEFORE_RESOLVED + 10);
  });


  it('does not replase newer results with obsolete ones from async validation ', (done) => {
    const validateAsync = jest.fn(() => new Promise(resolve => {
      const results = { valid: true, message: 'Nice!' };
      setTimeout(() => resolve(results), WAIT_BEFORE_RESOLVED);
    }));

    const Form = mountForm('onFirstChange', validateAsync);

    // User changes the `email` field
    Form.setProps({ data: { email: 'valid@email.com' } });
    Form.find('.email-input').simulate('change');

    Form.find('.email-input').simulate('blur');

    // validateAsync is triggered, processing label is shown w/o validity status
    expect(validateAsync).toHaveBeenCalledTimes(1);
    expect(Form.find('.email-message').text()).toBe('Checking...');
    expect(Form.find('.email-wrapper').hasClass('failure')).toBe(false);
    expect(Form.find('.email-wrapper').hasClass('success')).toBe(false);

    // User types invalid `email`
    Form.setProps({ data: { email: '', password: null } });
    Form.find('.email-input').simulate('change');

    // Error for `email` is shown
    expect(Form.find('.email-message').text()).toBe('Email is required');
    expect(Form.find('.email-wrapper').hasClass('failure')).toBe(true);
    expect(Form.find('.email-wrapper').hasClass('success')).toBe(false);

    // Waiting for async results...
    setTimeout(() => {
      try {
        // Error for `email` is still there
        expect(Form.find('.email-message').text()).toBe('Email is required');
        expect(Form.find('.email-wrapper').hasClass('failure')).toBe(true);
        expect(Form.find('.email-wrapper').hasClass('success')).toBe(false);
        done();
      } catch (error) {
        done.fail(error);
      }
    }, WAIT_BEFORE_RESOLVED + 10);
  });


  it('does not emit results on change if there is async validator w/ onBlur strategy', () => {
    const validateAsync = jest.fn(() => new Promise(() => null));

    const Form = mountForm('onFirstChange', validateAsync);

    // User changes the `email` field
    Form.setProps({ data: { email: 'valid@email.com' } });
    Form.find('.email-input').simulate('change');

    // No results for `email`
    expect(Form.find('.email-message').length).toBe(0);
    expect(Form.find('.email-wrapper').hasClass('failure')).toBe(false);
    expect(Form.find('.email-wrapper').hasClass('success')).toBe(false);

    Form.find('.email-input').simulate('blur');

    // validateAsync is triggered, processing label is shown w/o validity status
    expect(validateAsync).toHaveBeenCalledTimes(1);
    expect(Form.find('.email-message').text()).toBe('Checking...');
    expect(Form.find('.email-wrapper').hasClass('failure')).toBe(false);
    expect(Form.find('.email-wrapper').hasClass('success')).toBe(false);
  });
});
