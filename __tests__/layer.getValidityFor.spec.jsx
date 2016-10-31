import React from 'react';
import { mount } from 'enzyme';

import { mockLayerProps } from './utils';

import ValidationLayer from '../src';


describe('layer.getValidityFor()', () => {
  it('returns correct validity', () => {
    const layerProps = mockLayerProps({
      feedbackStrategy: 'onChange',
      data: { email: '' },
      fields: [{
        attr: 'email',
        validate: v => !!v && /.*@.*\..*/.test(v),
      }],
    });

    const printValidity = (valid) => {
      switch (valid) {
        case true:
          return 'valid';
        case false:
          return 'invalid';
        default:
          return 'none';
      }
    };

    const Form = mount(
      <ValidationLayer {...layerProps}>
        {layer => (
          <div>
            <input type="text" className="input" {...layer.getPropsFor('email')} />
            <span className="validity">
              {printValidity(layer.getValidityFor('email'))}
            </span>
          </div>
        )}
      </ValidationLayer>
    );

    // No validity on mount
    expect(Form.find('.validity').text()).toBe('none');

    // Should be valid on valid email
    Form.setProps({ data: { email: 'valid@email.com' } });
    Form.find('.input').simulate('change');
    expect(Form.find('.validity').text()).toBe('valid');

    // Should be invalid on invalid email
    Form.setProps({ data: { email: 'invalid@email' } });
    Form.find('.input').simulate('change');
    expect(Form.find('.validity').text()).toBe('invalid');
  });
});
