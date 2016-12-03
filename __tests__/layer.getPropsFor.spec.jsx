import * as passwordField from './factories/fields/password';
import { shallowRenderPasswordForm } from './factories/forms/PasswordForm';

describe('layer.getPropsFor()', () => {
  it('returns correct set of props', () => {
    const Form = shallowRenderPasswordForm({
      feedbackStrategy: 'onSubmit',
      data: { password: '1234' },
      fields: [passwordField.noValidation()],
    });

    const inputProps = Form.find('.password-input').props();

    expect(inputProps.value).toBe('1234');
    expect(inputProps.disabled).toBe(undefined);
    expect(inputProps.id).toBe('data___password');
    expect(inputProps['data-fieldid']).toBe('data.password');
    expect(inputProps.onChange).toBeInstanceOf(Function);
    expect(inputProps.onBlur).toBeInstanceOf(Function);
  });
});
