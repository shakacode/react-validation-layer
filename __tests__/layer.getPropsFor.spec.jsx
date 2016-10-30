import React from 'react';
import { shallow } from 'enzyme';

import ValidationLayer from '../src';


describe('layer.getPropsFor()', () => {
  it('returns correct set of props', () => {
    const layerProps = {
      dataKey: 'data',
      data: { testField: 'testValue' },
      fields: [{ attr: 'testField' }],
      handlers: {
        onChange: v => v,
        onSubmit: v => v,
      },
    };

    const Form = shallow(
      <ValidationLayer {...layerProps}>
        {layer => (
          <input type="text" className="input" {...layer.getPropsFor('testField')} />
        )}
      </ValidationLayer>
    );

    const inputProps = Form.find('.input').props();

    expect(inputProps.value).toBe('testValue');
    expect(inputProps.disabled).toBe(undefined);
    expect(inputProps.id).toBe('data___testField');
    expect(inputProps['data-fieldid']).toBe('data.testField');
    expect(inputProps.onChange).toBeInstanceOf(Function);
    expect(inputProps.onBlur).toBeInstanceOf(Function);
  });
});
