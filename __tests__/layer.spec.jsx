import React from 'react';
import { shallow } from 'enzyme';

import ValidationLayer from '../src';


describe('layer', () => {
  it('contains fields data and correct set of methods', () => {
    const layerProps = {
      dataKey: 'data',
      data: {
        testField1: 'testValue1',
        testField2: 'testValue2',
      },
      fields: [
        { attr: 'testField1' },
        { attr: 'testField2' },
      ],
      handlers: {
        onChange: v => v,
        onSubmit: v => v,
      },
    };

    let layer;

    shallow(
      <ValidationLayer {...layerProps}>
        {nextLayer => {
          layer = nextLayer;
          return null;
        }}
      </ValidationLayer>
    );

    expect(layer).toBeInstanceOf(Object);

    expect(layer.fields['data.testField1'].props).toBeInstanceOf(Object);
    expect(layer.fields['data.testField2'].props).toBeInstanceOf(Object);

    expect(layer.getPropsFor).toBeInstanceOf(Function);
    expect(layer.getCheckboxPropsFor).toBeInstanceOf(Function);
    expect(layer.getRadioButtonPropsFor).toBeInstanceOf(Function);
    expect(layer.getCustomPropsFor).toBeInstanceOf(Function);
    expect(layer.getValidityFor).toBeInstanceOf(Function);
    expect(layer.getMessageFor).toBeInstanceOf(Function);
    expect(layer.getStatusFor).toBeInstanceOf(Function);
    expect(layer.getFieldIdFor).toBeInstanceOf(Function);
    expect(layer.getDomIdFor).toBeInstanceOf(Function);
    expect(layer.getDomIdForRadioButton).toBeInstanceOf(Function);
    expect(layer.getCustomDomIdFor).toBeInstanceOf(Function);
    expect(layer.handleChange).toBeInstanceOf(Function);
    expect(layer.handleBlur).toBeInstanceOf(Function);
    expect(layer.handleSubmit).toBeInstanceOf(Function);

    expect(Object.keys(layer).length).toBe(15);
    expect(Object.keys(layer.fields).length).toBe(2);
  });
});
