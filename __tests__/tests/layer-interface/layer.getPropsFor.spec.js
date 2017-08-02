/* @flow */

import { mountPasswordForm } from '../../factories/forms/PasswordForm';

describe('layer.getPropsFor()', () => {
  const mountForm = () =>
    mountPasswordForm({
      id: 'passwordForm',
      strategy: 'onFirstSubmit',
      data: { password: '1234' },
      fields: { password: true },
    });

  it('returns props for common input element', () => {
    const Form = mountForm();

    const inputProps = Form.find('.password-input').props();

    expect(inputProps.value).toBe('1234');
    expect(inputProps.disabled).toBe(undefined);
    expect(inputProps.id).toBe('passwordForm___password');
    expect(inputProps['data-fieldid']).toBe('password');
    expect(inputProps.onChange).toBeInstanceOf(Function);
    expect(inputProps.onBlur).toBeInstanceOf(Function);
  });

  it('returns props w/ disabled input while form is being submitted', () => {
    const Form = mountForm();

    Form.find('.form').simulate('submit');

    const inputProps = Form.find('.password-input').props();

    expect(inputProps.disabled).toBe(true);
  });
});
