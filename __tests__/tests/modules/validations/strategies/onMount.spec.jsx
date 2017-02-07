/* @flow */

import { mountLoginForm } from '../../../../factories/forms/LoginForm';

describe('strategy.onMount', () => {
  const mountForm = () => mountLoginForm({ strategy: 'onMount' });

  it('emits results on mount', () => {
    const Form = mountForm();

    // Error for `email` is shown
    expect(Form.find('.email-message').text()).toBe('Email is required');
    expect(Form.find('.email-wrapper').hasClass('failure')).toBe(true);
    expect(Form.find('.email-wrapper').hasClass('success')).toBe(false);

    // Error for `password` is shown
    expect(Form.find('.password-message').text()).toBe('Password is required');
    expect(Form.find('.password-wrapper').hasClass('failure')).toBe(true);
    expect(Form.find('.password-wrapper').hasClass('success')).toBe(false);
  });


  it('emits results on change', () => {
    const Form = mountForm();

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


  xit('async validations', () => {});
});
