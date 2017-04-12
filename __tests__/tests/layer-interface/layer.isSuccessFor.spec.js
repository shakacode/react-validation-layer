/* @flow */

import React from 'react';
import { mount } from 'enzyme';

import ValidationLayer from '../../../src';

describe('layer.isSuccessFor()', () => {
  it('returns boolean either success or not', () => {
    const Form = mount(
      <ValidationLayer
        strategy="onFirstChange"
        data={{ email: null }}
        fields={{ email: { validate: email => !!email } }}
        handlers={{
          onChange: () => undefined,
          onSubmit: () => undefined,
        }}
      >
        {layer => (
          <div>
            <input
              className="input"
              {...layer.getPropsFor('email')}
            />
            <div className="result">
              {
                layer.isSuccessFor('email')
                ? 'success'
                : 'not-success'
              }
            </div>
          </div>
        )}
      </ValidationLayer>,
    );

    // No validity reported on mount
    expect(Form.find('.result').text()).toBe('not-success');

    // Should be success on valid email
    Form.setProps({ data: { email: 'valid@email.com' } });
    Form.find('.input').simulate('change');
    expect(Form.find('.result').text()).toBe('success');

    // Should be not-success on invalid email
    Form.setProps({ data: { email: '' } });
    Form.find('.input').simulate('change');
    expect(Form.find('.result').text()).toBe('not-success');
  });


  it('returns false if validation succeeded, but field has no value', () => {
    const Form = mount(
      <ValidationLayer
        strategy="onFirstChange"
        data={{ email: null }}
        fields={{ email: true }}
        handlers={{
          onChange: () => undefined,
          onSubmit: () => undefined,
        }}
      >
        {layer => (
          <div>
            <input
              className="input"
              {...layer.getPropsFor('email')}
            />
            <div className="result">
              {
                layer.isSuccessFor('email')
                ? 'success'
                : 'not-success'
              }
            </div>
          </div>
        )}
      </ValidationLayer>,
    );

    // No validity reported on mount
    expect(Form.find('.result').text()).toBe('not-success');

    // Should be success on valid email
    Form.setProps({ data: { email: 'valid@email.com' } });
    Form.find('.input').simulate('change');
    expect(Form.find('.result').text()).toBe('success');

    // Should be not-success on no email (even if it's a valid case)
    Form.setProps({ data: { email: '' } });
    Form.find('.input').simulate('change');
    expect(Form.find('.result').text()).toBe('not-success');
  });
});
