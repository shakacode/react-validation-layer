/* @flow */

import { mountPasswordForm } from '../../factories/forms/PasswordForm';

describe('layer.getSubmitButtonProps()', () => {
  const mountForm = () =>
    mountPasswordForm({
      id: 'passwordForm',
      strategy: 'onFirstSubmit',
      data: { password: '1234' },
      fields: { password: true },
    });

  it('returns props w/ `disabled: false` for submit button when form is not being submitted', () => {
    const Form = mountForm();

    const buttonProps = Form.find('.submit-button').props();

    expect(buttonProps.type).toBe('submit');
    expect(buttonProps.disabled).toBe(false);
  });

  it('returns props w/ `disabled: true` for submit button when form is being submitted', () => {
    const Form = mountForm();

    Form.find('.form').simulate('submit');

    const buttonProps = Form.find('.submit-button').props();

    expect(buttonProps.type).toBe('submit');
    expect(buttonProps.disabled).toBe(true);
  });
});
