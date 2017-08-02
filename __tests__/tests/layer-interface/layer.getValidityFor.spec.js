/* @flow */

import * as passwordField from '../../factories/fields/password';
import { mountPasswordForm } from '../../factories/forms/PasswordForm';

describe('layer.getValidityFor()', () => {
  it('returns validity', () => {
    const Form = mountPasswordForm({
      strategy: 'onFirstChange',
      data: { password: null },
      fields: {
        password: passwordField.validatePresenceAndLengthWithBoolOutput(),
      },
    });

    // No validity reported on mount
    expect(Form.find('.password-validity').text()).toBe('none');

    // Should be valid on valid password
    Form.setProps({ data: { password: '1234' } });
    Form.find('.password-input').simulate('change');
    expect(Form.find('.password-validity').text()).toBe('valid');

    // Should be invalid on invalid password
    Form.setProps({ data: { password: '123' } });
    Form.find('.password-input').simulate('change');
    expect(Form.find('.password-validity').text()).toBe('invalid');
  });
});
