import React from 'react';
import { shallow } from 'enzyme';

import { mockLayerProps } from './utils';

import ValidationLayer from '../src';


describe('layer.getPropsFor()', () => {
  it('returns correct set of props', () => {
    const layerProps = mockLayerProps({
      feedbackStrategy: 'onSubmit',
      data: { email: 'my@email.com' },
      fields: [{ attr: 'email' }],
    });

    const Form = shallow(
      <ValidationLayer {...layerProps}>
        {layer => (
          <input type="text" className="input" {...layer.getPropsFor('email')} />
        )}
      </ValidationLayer>
    );

    const inputProps = Form.find('.input').props();

    expect(inputProps.value).toBe('my@email.com');
    expect(inputProps.disabled).toBe(undefined);
    expect(inputProps.id).toBe('data___email');
    expect(inputProps['data-fieldid']).toBe('data.email');
    expect(inputProps.onChange).toBeInstanceOf(Function);
    expect(inputProps.onBlur).toBeInstanceOf(Function);
  });
});
