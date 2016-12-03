import React from 'react';
import { shallow } from 'enzyme';

import { mockLayerProps } from './helpers';

import * as emailField from './factories/fields/email';
import * as passwordField from './factories/fields/password';

import ValidationLayer from '../src';


describe('layer', () => {
  it('contains fields data and correct set of methods', () => {
    const layerProps = mockLayerProps({
      feedbackStrategy: 'onSubmit',
      data: { email: 'my@email.com', password: 'mypassword' },
      fields: [emailField.noValidation(), passwordField.noValidation()],
    });

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

    expect(layer.fields['data.email'].props).toBeInstanceOf(Object);
    expect(layer.fields['data.password'].props).toBeInstanceOf(Object);

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
