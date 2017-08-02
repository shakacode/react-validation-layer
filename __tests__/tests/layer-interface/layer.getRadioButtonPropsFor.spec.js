/* @flow */

import { mountSubscriptionForm } from '../../factories/forms/SubscriptionForm';

describe('layer.getRadioButtonPropsFor()', () => {
  const mountForm = () =>
    mountSubscriptionForm({
      id: 'subscriptionForm',
      strategy: 'onFirstSubmit',
      data: { frequency: 'monthly', permit: true },
      fields: { frequency: true, permit: true },
    });

  it('returns props for active radio button', () => {
    const Form = mountForm();

    const radioButtonProps = Form.find('.frequency-radio-monthly').props();

    expect(radioButtonProps.checked).toBe(true);
    expect(radioButtonProps.value).toBe('monthly');
    expect(radioButtonProps.disabled).toBe(undefined);
    expect(radioButtonProps.id).toBe('subscriptionForm___frequency___monthly');
    expect(radioButtonProps['data-fieldid']).toBe('frequency');
    expect(radioButtonProps.onChange).toBeInstanceOf(Function);
    expect(radioButtonProps.onBlur).toBeInstanceOf(Function);
  });

  it('returns props for inactive radio button', () => {
    const Form = mountForm();

    const radioButtonProps = Form.find('.frequency-radio-weekly').props();

    expect(radioButtonProps.checked).toBe(false);
    expect(radioButtonProps.value).toBe('weekly');
    expect(radioButtonProps.disabled).toBe(undefined);
    expect(radioButtonProps.id).toBe('subscriptionForm___frequency___weekly');
    expect(radioButtonProps['data-fieldid']).toBe('frequency');
    expect(radioButtonProps.onChange).toBeInstanceOf(Function);
    expect(radioButtonProps.onBlur).toBeInstanceOf(Function);
  });

  it('returns props w/ disabled radio buttons while form is being submitted', () => {
    const Form = mountForm();

    Form.find('.form').simulate('submit');

    const weeklyRadioButtonProps = Form.find('.frequency-radio-weekly').props();
    const monthlyRadioButtonProps = Form.find(
      '.frequency-radio-monthly',
    ).props();

    expect(weeklyRadioButtonProps.disabled).toBe(true);
    expect(monthlyRadioButtonProps.disabled).toBe(true);
  });
});
