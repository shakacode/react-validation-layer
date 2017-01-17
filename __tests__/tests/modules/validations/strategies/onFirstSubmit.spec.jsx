/* @flow */

import { mountLoginForm } from '../../../../factories/forms/LoginForm';

describe('strategy.onFirstSubmit', () => {
  const mountForm = () => mountLoginForm({ strategy: 'onFirstSubmit' });

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


  it('does not emits results on first blur', () => {
    const Form = mountForm();

    // User blures from the `email` field
    Form.find('.email-input').simulate('blur');

    // No results are shown
    expect(Form.find('.email-message').length).toBe(0);
    expect(Form.find('.email-wrapper').hasClass('failure')).toBe(false);
    expect(Form.find('.email-wrapper').hasClass('success')).toBe(false);

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


  it('does not emit results on valid data', () => {
    const Form = mountForm();

    // User types valid `email`
    Form.setProps({ data: { email: 'valid@email.com', password: null } });
    Form.find('.email-input').simulate('change');

    // No results are shown
    expect(Form.find('.email-message').length).toBe(0);
    expect(Form.find('.email-wrapper').hasClass('failure')).toBe(false);
    expect(Form.find('.email-wrapper').hasClass('success')).toBe(false);

    expect(Form.find('.password-message').length).toBe(0);
    expect(Form.find('.password-wrapper').hasClass('failure')).toBe(false);
    expect(Form.find('.password-wrapper').hasClass('success')).toBe(false);
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
