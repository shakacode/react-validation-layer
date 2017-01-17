/* @flow */
/* eslint-disable max-len */

import { mountPasswordForm } from '../../factories/forms/PasswordForm';

describe('case.triggerInstantValidationsOnlyOnce', () => {
  it('triggers instant validation only once', () => {
    const validate = jest.fn();

    const Form = mountPasswordForm({
      strategy: 'instant',
      data: { password: null },
      fields: {
        password: {
          validate() {
            validate();
            return true;
          },
        },
      },
    });

    Form.find('.password-input').simulate('change');
    Form.setProps({ data: { password: '123' } });

    // 1. on mount
    // 2. on update, NOT on change
    expect(validate).toHaveBeenCalledTimes(2);
  });


  it('triggers instantTouchedOnly validation only once', () => {
    const validate = jest.fn();

    const Form = mountPasswordForm({
      strategy: 'instantTouchedOnly',
      data: { password: null },
      fields: {
        password: {
          validate() {
            validate();
            return true;
          },
        },
      },
    });

    Form.find('.password-input').simulate('change');
    Form.setProps({ data: { password: '123' } });

    // 1. on update, NOT on change
    expect(validate).toHaveBeenCalledTimes(1);
  });
});
