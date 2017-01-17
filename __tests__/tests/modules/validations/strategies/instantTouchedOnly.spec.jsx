/* @flow */

import { mountLoginForm } from '../../../../factories/forms/LoginForm';

describe('strategy.instantTouchedOnly', () => {
  const mountForm = () => mountLoginForm({ strategy: 'instantTouchedOnly' });

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


  it('emits results on blur', () => {
    const Form = mountForm();

    // User blures from the `email` field
    Form.find('.email-input').simulate('blur');

    // Error for `email` is shown
    expect(Form.find('.email-message').text()).toBe('Email is required');
    expect(Form.find('.email-wrapper').hasClass('failure')).toBe(true);
    expect(Form.find('.email-wrapper').hasClass('success')).toBe(false);

    // Still no results for `password`
    expect(Form.find('.password-message').length).toBe(0);
    expect(Form.find('.password-wrapper').hasClass('failure')).toBe(false);
    expect(Form.find('.password-wrapper').hasClass('success')).toBe(false);

    // User blures from the `password` field
    Form.find('.password-input').simulate('blur');

    // Error for `password` is shown
    expect(Form.find('.password-message').text()).toBe('Password is required');
    expect(Form.find('.password-wrapper').hasClass('failure')).toBe(true);
    expect(Form.find('.password-wrapper').hasClass('success')).toBe(false);

    // Error for `email` is still there
    expect(Form.find('.email-message').text()).toBe('Email is required');
    expect(Form.find('.email-wrapper').hasClass('failure')).toBe(true);
    expect(Form.find('.email-wrapper').hasClass('success')).toBe(false);
  });


  it('emits results on change', () => {
    const Form = mountForm();

    // User types invalid `email`
    Form.find('.email-input').simulate('change');
    Form.setProps({ data: { email: 'invalid@email', password: null } });

    // Error for `email` is shown
    expect(Form.find('.email-message').text()).toBe('Email is invalid');
    expect(Form.find('.email-wrapper').hasClass('failure')).toBe(true);
    expect(Form.find('.email-wrapper').hasClass('success')).toBe(false);

    // Still no results for `password`
    expect(Form.find('.password-message').length).toBe(0);
    expect(Form.find('.password-wrapper').hasClass('failure')).toBe(false);
    expect(Form.find('.password-wrapper').hasClass('success')).toBe(false);

    // User types invalid `password`
    Form.find('.password-input').simulate('change');
    Form.setProps({ data: { email: 'invalid@email', password: '123' } });

    // Error for `password` is shown
    expect(Form.find('.password-message').text()).toBe('Password is too short');
    expect(Form.find('.password-wrapper').hasClass('failure')).toBe(true);
    expect(Form.find('.password-wrapper').hasClass('success')).toBe(false);

    // Error for `email` is still there
    expect(Form.find('.email-message').text()).toBe('Email is invalid');
    expect(Form.find('.email-wrapper').hasClass('failure')).toBe(true);
    expect(Form.find('.email-wrapper').hasClass('success')).toBe(false);

    // User types valid `email`
    Form.find('.email-input').simulate('change');
    Form.setProps({ data: { email: 'valid@email.com', password: '123' } });

    // Success for `email`
    expect(Form.find('.email-message').length).toBe(0);
    expect(Form.find('.email-wrapper').hasClass('failure')).toBe(false);
    expect(Form.find('.email-wrapper').hasClass('success')).toBe(true);

    // Error for `password` is still there
    expect(Form.find('.password-message').text()).toBe('Password is too short');
    expect(Form.find('.password-wrapper').hasClass('failure')).toBe(true);
    expect(Form.find('.password-wrapper').hasClass('success')).toBe(false);

    // User types valid `password`
    Form.find('.password-input').simulate('change');
    Form.setProps({ data: { email: 'valid@email.com', password: '1234' } });

    // Success for `password`
    expect(Form.find('.password-message').length).toBe(0);
    expect(Form.find('.password-wrapper').hasClass('failure')).toBe(false);
    expect(Form.find('.password-wrapper').hasClass('success')).toBe(true);
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
    Form.find('.email-input').simulate('change');
    Form.setProps({ data: { email: 'invalid@email', password: null } });

    // Error for `email` is shown
    expect(Form.find('.email-message').text()).toBe('Email is invalid');
    expect(Form.find('.email-wrapper').hasClass('failure')).toBe(true);
    expect(Form.find('.email-wrapper').hasClass('success')).toBe(false);
  });
});
