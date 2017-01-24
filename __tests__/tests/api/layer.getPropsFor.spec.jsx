/* @flow */

import { shallowRenderPasswordForm } from '../../factories/forms/PasswordForm';

describe('layer.getPropsFor()', () => {
  it('returns correct set of props', () => {
    const Form = shallowRenderPasswordForm({
      id: 'passwordForm',
      strategy: 'onFirstSubmit',
      data: { password: '1234' },
      fields: { password: true },
    });

    const inputProps = Form.find('.password-input').props();

    expect(inputProps.value).toBe('1234');
    expect(inputProps.disabled).toBe(undefined);
    expect(inputProps.id).toBe('passwordForm___password');
    expect(inputProps['data-fieldid']).toBe('password');
    expect(inputProps.onChange).toBeInstanceOf(Function);
    expect(inputProps.onBlur).toBeInstanceOf(Function);
  });
});
