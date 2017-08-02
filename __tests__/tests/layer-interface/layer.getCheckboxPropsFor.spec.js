/* @flow */

import { mountSubscriptionForm } from '../../factories/forms/SubscriptionForm';

describe('layer.getCheckboxPropsFor()', () => {
  const mountForm = () =>
    mountSubscriptionForm({
      id: 'subscriptionForm',
      strategy: 'onFirstSubmit',
      data: { frequency: null, permit: true },
      fields: { frequency: true, permit: true },
    });

  it('returns props for checkbox', () => {
    const Form = mountForm();

    const checkboxProps = Form.find('.permit-checkbox').props();

    expect(checkboxProps.checked).toBe(true);
    expect(checkboxProps.value).toBe(true);
    expect(checkboxProps.disabled).toBe(undefined);
    expect(checkboxProps.id).toBe('subscriptionForm___permit');
    expect(checkboxProps['data-fieldid']).toBe('permit');
    expect(checkboxProps.onChange).toBeInstanceOf(Function);
    expect(checkboxProps.onBlur).toBeInstanceOf(Function);
  });

  it('returns props w/ disabled checkbox while form is being submitted', () => {
    const Form = mountForm();

    Form.find('.form').simulate('submit');

    const checkboxProps = Form.find('.permit-checkbox').props();

    expect(checkboxProps.disabled).toBe(true);
  });
});
