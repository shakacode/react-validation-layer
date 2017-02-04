/* @flow */

import { mountLoginForm } from '../../factories/forms/LoginForm';

describe('ValidationLayer.handleFailurePostSubmitAction()', () => {
  it('updates state with external errors', () => {
    const onSubmit = jest.fn();

    const Form = mountLoginForm({
      strategy: 'onFirstSubmit',
      handlers: { onSubmit },
    });

    // Setting valid data to submit form
    Form.setProps({ data: { email: 'valid@email.com', password: '1234' } });

    // Submitting form
    Form.find('.form').simulate('submit');

    // Checking that onSubmit handler was triggered
    expect(onSubmit).toHaveBeenCalledTimes(1);

    // Callbackes passed from ValidationLayer
    const onSubmitCallbacks = onSubmit.mock.calls[0][0];

    // Checking that onFailure callback was passed
    expect(onSubmitCallbacks.onFailure).toBeInstanceOf(Function);

    // Dummy error from remote API
    const emailExternalErrors = { email: 'External email error' };

    // Triggering onFailure callback with errors
    onSubmitCallbacks.onFailure(emailExternalErrors);

    // External error for `email` is shown
    expect(Form.find('.email-message').text()).toBe('External email error');
    expect(Form.find('.email-wrapper').hasClass('failure')).toBe(true);
    expect(Form.find('.email-wrapper').hasClass('success')).toBe(false);
  });
});
