import { mountLoginForm } from './factories/forms/LoginForm';

describe('strategy.onChange', () => {
  const mountForm = () => mountLoginForm({ feedbackStrategy: 'onChange' });

  it('does not emit results on mount', () => {
    const Form = mountForm();

    // No results are shown on mount
    expect(Form.find('.email-message').length).toBe(0);
    expect(Form.find('.email-wrapper').hasClass('error')).toBe(false);
    expect(Form.find('.email-wrapper').hasClass('success')).toBe(false);

    expect(Form.find('.password-message').length).toBe(0);
    expect(Form.find('.password-wrapper').hasClass('error')).toBe(false);
    expect(Form.find('.password-wrapper').hasClass('success')).toBe(false);
  });


  it('does not emit results on blur', () => {
    const Form = mountForm();

    // User blures from the `email` field
    Form.find('.email-input').simulate('blur');

    // Still no results are shown
    expect(Form.find('.email-message').length).toBe(0);
    expect(Form.find('.email-wrapper').hasClass('error')).toBe(false);
    expect(Form.find('.email-wrapper').hasClass('success')).toBe(false);

    expect(Form.find('.password-message').length).toBe(0);
    expect(Form.find('.password-wrapper').hasClass('error')).toBe(false);
    expect(Form.find('.password-wrapper').hasClass('success')).toBe(false);
  });


  it('emits results on change', () => {
    const Form = mountForm();

    // User types invalid `email`
    Form.setProps({ data: { email: 'invalid@email', password: null } });
    Form.find('.email-input').simulate('change');

    // Error for `email` is shown
    expect(Form.find('.email-message').text()).toBe('Email is invalid');
    expect(Form.find('.email-wrapper').hasClass('error')).toBe(true);
    expect(Form.find('.email-wrapper').hasClass('success')).toBe(false);

    // Still no results for `password`
    expect(Form.find('.password-message').length).toBe(0);
    expect(Form.find('.password-wrapper').hasClass('error')).toBe(false);
    expect(Form.find('.password-wrapper').hasClass('success')).toBe(false);

    // User types invalid `password`
    Form.setProps({ data: { email: 'invalid@email', password: '123' } });
    Form.find('.password-input').simulate('change');

    // Error for `password` is shown
    expect(Form.find('.password-message').text()).toBe('Password is too short');
    expect(Form.find('.password-wrapper').hasClass('error')).toBe(true);
    expect(Form.find('.password-wrapper').hasClass('success')).toBe(false);

    // Error for `email` is still there
    expect(Form.find('.email-message').text()).toBe('Email is invalid');
    expect(Form.find('.email-wrapper').hasClass('error')).toBe(true);
    expect(Form.find('.email-wrapper').hasClass('success')).toBe(false);

    // User types valid `email`
    Form.setProps({ data: { email: 'valid@email.com', password: '123' } });
    Form.find('.email-input').simulate('change');

    // Success for `email`
    expect(Form.find('.email-message').length).toBe(0);
    expect(Form.find('.email-wrapper').hasClass('error')).toBe(false);
    expect(Form.find('.email-wrapper').hasClass('success')).toBe(true);

    // Error for `password` is still there
    expect(Form.find('.password-message').text()).toBe('Password is too short');
    expect(Form.find('.password-wrapper').hasClass('error')).toBe(true);
    expect(Form.find('.password-wrapper').hasClass('success')).toBe(false);

    // User types valid `password`
    Form.setProps({ data: { email: 'valid@email.com', password: '1234' } });
    Form.find('.password-input').simulate('change');

    // Success for `password`
    expect(Form.find('.password-message').length).toBe(0);
    expect(Form.find('.password-wrapper').hasClass('error')).toBe(false);
    expect(Form.find('.password-wrapper').hasClass('success')).toBe(true);
  });


  it('emits results instantly on and after submit', () => {
    const Form = mountForm();

    Form.find('.form').simulate('submit');

    // Error for `email` is shown
    expect(Form.find('.email-message').text()).toBe('Email is required');
    expect(Form.find('.email-wrapper').hasClass('error')).toBe(true);
    expect(Form.find('.email-wrapper').hasClass('success')).toBe(false);

    // Error for `password` is shown
    expect(Form.find('.password-message').text()).toBe('Password is required');
    expect(Form.find('.password-wrapper').hasClass('error')).toBe(true);
    expect(Form.find('.password-wrapper').hasClass('success')).toBe(false);

    // User types invalid `email`
    Form.setProps({ data: { email: 'invalid@email', password: null } });
    Form.find('.email-input').simulate('change');

    // Error for `email` is shown
    expect(Form.find('.email-message').text()).toBe('Email is invalid');
    expect(Form.find('.email-wrapper').hasClass('error')).toBe(true);
    expect(Form.find('.email-wrapper').hasClass('success')).toBe(false);
  });
});
