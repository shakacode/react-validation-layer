import { mountLoginForm } from './factories/forms/LoginForm';

describe('strategy.instant', () => {
  const mountForm = () => mountLoginForm({ feedbackStrategy: 'instant' });

  it('emits results on mount', () => {
    const Form = mountForm();

    // Error for `email` is shown
    expect(Form.find('.email-message').text()).toBe('Email is required');
    expect(Form.find('.email-wrapper').hasClass('error')).toBe(true);
    expect(Form.find('.email-wrapper').hasClass('success')).toBe(false);

    // Error for `password` is shown
    expect(Form.find('.password-message').text()).toBe('Password is required');
    expect(Form.find('.password-wrapper').hasClass('error')).toBe(true);
    expect(Form.find('.password-wrapper').hasClass('success')).toBe(false);
  });


  it('emits results on change', () => {
    const Form = mountForm();

    // User types valid `email`
    Form.setProps({ data: { email: 'valid@email.com', password: null } });
    Form.find('.email-input').simulate('change');

    // Success for `email`
    expect(Form.find('.email-message').length).toBe(0);
    expect(Form.find('.email-wrapper').hasClass('error')).toBe(false);
    expect(Form.find('.email-wrapper').hasClass('success')).toBe(true);

    // Error for `password` is still there
    expect(Form.find('.password-message').text()).toBe('Password is required');
    expect(Form.find('.password-wrapper').hasClass('error')).toBe(true);
    expect(Form.find('.password-wrapper').hasClass('success')).toBe(false);
  });
});
