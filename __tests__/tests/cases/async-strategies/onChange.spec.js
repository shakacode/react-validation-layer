/* @flow */

import { validatePresenceAndShapeWithMessages } from '../../../factories/fields/email';
import { mountSignupForm } from '../../../factories/forms/SignupForm';

describe('asyncStrategy.onChange()', () => {
  const DEBOUNCE_INTERVAL = 20;
  const WAIT_BEFORE_RESOLVED = 100;

  const mountForm = (strategy, validateAsync) => mountSignupForm({
    strategy,
    asyncStrategy: 'onChange',
    debounceInterval: DEBOUNCE_INTERVAL,
    fields: {
      email: {
        ...validatePresenceAndShapeWithMessages({
          presence: 'Email is required',
          shape: 'Email is invalid',
        }),
        validateAsync,
      },
      password: true,
      passwordConfirmation: true,
    },
  });


  it('does not trigger async validation on blur', () => {
    const validateAsync = jest.fn();

    const Form = mountForm('onFirstSuccess', validateAsync);

    // User blures from the `email` field
    Form.find('.email-input').simulate('blur');

    // validateAsync wasn't triggered
    expect(validateAsync).toHaveBeenCalledTimes(0);
  });


  it('does not trigger async validation if sync validation was not emitted', () => {
    const validateAsync = jest.fn();

    const Form = mountForm('onFirstSuccess', validateAsync);

    // User changes the `email` field
    Form.setProps({ data: { email: 'invalid@email' } });
    Form.find('.email-input').simulate('change');

    // No results for `email`
    expect(Form.find('.email-message').length).toBe(0);
    expect(Form.find('.email-wrapper').hasClass('failure')).toBe(false);
    expect(Form.find('.email-wrapper').hasClass('success')).toBe(false);

    // validateAsync wasn't triggered
    expect(validateAsync).toHaveBeenCalledTimes(0);
  });


  it('does not trigger async validation if sync validation failed with no value', () => {
    const validateAsync = jest.fn();

    const Form = mountForm('onFirstChange', validateAsync);

    // User types invalid `email`
    Form.setProps({ data: { email: '' } });
    Form.find('.email-input').simulate('change');

    // Error for `email` is shown
    expect(Form.find('.email-message').text()).toBe('Email is required');
    expect(Form.find('.email-wrapper').hasClass('failure')).toBe(true);
    expect(Form.find('.email-wrapper').hasClass('success')).toBe(false);

    // validateAsync wasn't triggered
    expect(validateAsync).toHaveBeenCalledTimes(0);
  });


  it('does not trigger async validation if sync validation failed with invalid value', () => {
    const validateAsync = jest.fn();

    const Form = mountForm('onFirstChange', validateAsync);

    // User types invalid `email`
    Form.setProps({ data: { email: 'invalid@email' } });
    Form.find('.email-input').simulate('change');

    // Error for `email` is shown
    expect(Form.find('.email-message').text()).toBe('Email is invalid');
    expect(Form.find('.email-wrapper').hasClass('failure')).toBe(true);
    expect(Form.find('.email-wrapper').hasClass('success')).toBe(false);

    // validateAsync wasn't triggered
    expect(validateAsync).toHaveBeenCalledTimes(0);
  });


  it('triggers debounced async validation on change', (done) => {
    const validateAsync = jest.fn();

    const Form = mountForm('onFirstChange', validateAsync);

    // User changes the `email` field
    Form.setProps({ data: { email: 'valid@email.com' } });
    Form.find('.email-input').simulate('change');

    // validateAsync wasn't triggered yet
    expect(validateAsync).toHaveBeenCalledTimes(0);

    // Waiting for debounce...
    setTimeout(() => {
      try {
        // validateAsync is triggered
        expect(validateAsync).toHaveBeenCalledTimes(1);
        done();
      } catch (error) {
        done.fail(error);
      }
    }, DEBOUNCE_INTERVAL + 10);
  });


  it('triggers debounced async validation on change and it provides interm and final feedback', (done) => {
    const validateAsync = jest.fn(() => new Promise(resolve => {
      const results = { valid: true, message: 'Nice!' };
      setTimeout(() => resolve(results), WAIT_BEFORE_RESOLVED);
    }));

    const Form = mountForm('onFirstSuccess', validateAsync);

    // User changes the `email` field
    Form.setProps({ data: { email: 'valid@email.com' } });
    Form.find('.email-input').simulate('change');

    // validateAsync wasn't triggered, processing label is shown w/o validity status
    expect(validateAsync).toHaveBeenCalledTimes(0);
    expect(Form.find('.email-message').text()).toBe('Checking...');
    expect(Form.find('.email-wrapper').hasClass('failure')).toBe(false);
    expect(Form.find('.email-wrapper').hasClass('success')).toBe(false);

    // Waiting for debounce...
    setTimeout(() => {
      try {
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
        }, WAIT_BEFORE_RESOLVED + 50);
      } catch (error) {
        done.fail(error);
      }
    }, DEBOUNCE_INTERVAL + 10);
  });


  it('does not replase newer results with obsolete ones from async validation ', (done) => {
    const validateAsync = jest.fn(() => new Promise(resolve => {
      const results = { valid: true, message: 'Nice!' };
      setTimeout(() => resolve(results), WAIT_BEFORE_RESOLVED);
    }));

    const Form = mountForm('onFirstSuccess', validateAsync);

    // User changes the `email` field
    Form.setProps({ data: { email: 'valid@email.com' } });
    Form.find('.email-input').simulate('change');

    // Waiting for debounce...
    setTimeout(() => {
      try {
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
        }, WAIT_BEFORE_RESOLVED + 20);
      } catch (error) {
        done.fail(error);
      }
    }, DEBOUNCE_INTERVAL + 10);
  });
});
