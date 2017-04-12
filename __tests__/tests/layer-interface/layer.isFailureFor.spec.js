/* @flow */

import React from 'react';
import { mount } from 'enzyme';

import ValidationLayer from '../../../src';

describe('layer.isFailureFor()', () => {
  it('returns boolean either failure or not', () => {
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
                layer.isFailureFor('email')
                ? 'failure'
                : 'not-failure'
              }
            </div>
          </div>
        )}
      </ValidationLayer>,
    );

    // No validity reported on mount
    expect(Form.find('.result').text()).toBe('not-failure');

    // Should be not-failure on valid email
    Form.setProps({ data: { email: 'valid@email.com' } });
    Form.find('.input').simulate('change');
    expect(Form.find('.result').text()).toBe('not-failure');

    // Should be failure on invalid email
    Form.setProps({ data: { email: '' } });
    Form.find('.input').simulate('change');
    expect(Form.find('.result').text()).toBe('failure');
  });
});
