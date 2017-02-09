/* @flow */

import { mountLoginForm } from '../../../factories/forms/LoginForm';

describe('strategy.onFirstSuccessOrFirstBlur', () => {
  const mountForm = () => mountLoginForm({ strategy: 'onFirstSuccessOrFirstBlur' });

  it('does not emit results on mount', () => {
    const Form = mountForm();

    // No results are shown on mount
    expect(Form.find('.email-message').length).toBe(0);
    expect(Form.find('.email-wrapper').hasClass('failure')).toBe(false);
    expect(Form.find('.email-wrapper').hasClass('success')).toBe(false);

    expect(Form.find('.password-message').length).toBe(0);
    expect(Form.find('.password-wrapper').hasClass('failure')).toBe(false);
    expect(Form.find('.password-wrapper').hasClass('success')).toBe(false);
  });


  it('emits results on first blur', () => {
    const Form = mountForm();

    // User blures from the `email` field
    Form.find('.email-input').simulate('blur');

    // Error for `email` is shown
    expect(Form.find('.email-message').text()).toBe('Email is required');
    expect(Form.find('.email-wrapper').hasClass('failure')).toBe(true);
    expect(Form.find('.email-wrapper').hasClass('success')).toBe(false);

    // No results for `password`
    expect(Form.find('.password-message').length).toBe(0);
    expect(Form.find('.password-wrapper').hasClass('failure')).toBe(false);
    expect(Form.find('.password-wrapper').hasClass('success')).toBe(false);

    // User types invalid `email`
    Form.setProps({ data: { email: 'invalid@email', password: null } });
    Form.find('.email-input').simulate('change');

    // Error for `email` is shown
    expect(Form.find('.email-message').text()).toBe('Email is invalid');
    expect(Form.find('.email-wrapper').hasClass('failure')).toBe(true);
    expect(Form.find('.email-wrapper').hasClass('success')).toBe(false);

    // User types valid `email`
    Form.setProps({ data: { email: 'valid@email.com', password: null } });
    Form.find('.email-input').simulate('change');

    // Success for `email`
    expect(Form.find('.email-message').length).toBe(0);
    expect(Form.find('.email-wrapper').hasClass('failure')).toBe(false);
    expect(Form.find('.email-wrapper').hasClass('success')).toBe(true);

    // Still no results for `password`
    expect(Form.find('.password-message').length).toBe(0);
    expect(Form.find('.password-wrapper').hasClass('failure')).toBe(false);
    expect(Form.find('.password-wrapper').hasClass('success')).toBe(false);
  });


  it('does not emit results on invalid data', () => {
    const Form = mountForm();

    // User types invalid `email`
    Form.setProps({ data: { email: 'invalid@email', password: null } });
    Form.find('.email-input').simulate('change');

    // No results are shown
    expect(Form.find('.email-message').length).toBe(0);
    expect(Form.find('.email-wrapper').hasClass('failure')).toBe(false);
    expect(Form.find('.email-wrapper').hasClass('success')).toBe(false);

    expect(Form.find('.password-message').length).toBe(0);
    expect(Form.find('.password-wrapper').hasClass('failure')).toBe(false);
    expect(Form.find('.password-wrapper').hasClass('success')).toBe(false);
  });


  it('emits results on valid data', () => {
    const Form = mountForm();

    // User types valid `email`
    Form.setProps({ data: { email: 'valid@email.com', password: null } });
    Form.find('.email-input').simulate('change');

    // Success for `email`
    expect(Form.find('.email-message').length).toBe(0);
    expect(Form.find('.email-wrapper').hasClass('failure')).toBe(false);
    expect(Form.find('.email-wrapper').hasClass('success')).toBe(true);
  });


  it('emits results on invalid data after first results were emitted', () => {
    const Form = mountForm();

    // User types valid `email`
    Form.setProps({ data: { email: 'valid@email.com', password: null } });
    Form.find('.email-input').simulate('change');

    // Success for `email`
    expect(Form.find('.email-message').length).toBe(0);
    expect(Form.find('.email-wrapper').hasClass('failure')).toBe(false);
    expect(Form.find('.email-wrapper').hasClass('success')).toBe(true);

    // User types invalid `email`
    Form.setProps({ data: { email: 'invalid@email', password: null } });
    Form.find('.email-input').simulate('change');

    // Error for `email` is shown
    expect(Form.find('.email-message').text()).toBe('Email is invalid');
    expect(Form.find('.email-wrapper').hasClass('failure')).toBe(true);
    expect(Form.find('.email-wrapper').hasClass('success')).toBe(false);
  });


  it('emits results instantly on and after submit', () => {
    const Form = mountForm();

    Form.find('.form').simulate('submit');

    // Error for `email` is shown
    expect(Form.find('.email-message').text()).toBe('Email is required');
    expect(Form.find('.email-wrapper').hasClass('failure')).toBe(true);
    expect(Form.find('.email-wrapper').hasClass('success')).toBe(false);

    // Error for `password` is shown
    expect(Form.find('.password-message').text()).toBe('Password is required');
    expect(Form.find('.password-wrapper').hasClass('failure')).toBe(true);
    expect(Form.find('.password-wrapper').hasClass('success')).toBe(false);

    // User types invalid `email`
    Form.setProps({ data: { email: 'invalid@email', password: null } });
    Form.find('.email-input').simulate('change');

    // Error for `email` is shown
    expect(Form.find('.email-message').text()).toBe('Email is invalid');
    expect(Form.find('.email-wrapper').hasClass('failure')).toBe(true);
    expect(Form.find('.email-wrapper').hasClass('success')).toBe(false);
  });
});
