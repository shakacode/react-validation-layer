/* @flow */
/* eslint-disable no-underscore-dangle */

import React from 'react';
import { shallow } from 'enzyme';

import Layer from '../../../src/containers/Layer';

import { mockStrictLayerProps } from '../../helpers';

import ValidationLayer from '../../../src';


describe('layer', () => {
  it('contains fields data and correct set of methods', () => {
    const layerProps = mockStrictLayerProps({
      id: 'loginForm',
      strategy: 'onFirstSubmit',
      data: { email: 'my@email.com', password: 'mypassword' },
      fields: { email: true, password: true },
    });

    let layer: ?Layer;

    shallow(
      <ValidationLayer {...layerProps}>
        {nextLayer => {
          layer = nextLayer;
          return null;
        }}
      </ValidationLayer>,
    );

    if (!layer) throw new Error('`layer` is not defined');

    expect(layer).toBeInstanceOf(Object);

    expect(layer.__layerId).toBe('loginForm');

    expect(layer.__fields.email.props).toBeInstanceOf(Object);
    expect(layer.__fields.password.props).toBeInstanceOf(Object);

    expect(layer.__getField).toBeInstanceOf(Function);

    expect(layer.getPropsFor).toBeInstanceOf(Function);
    expect(layer.getCheckboxPropsFor).toBeInstanceOf(Function);
    expect(layer.getRadioButtonPropsFor).toBeInstanceOf(Function);
    expect(layer.getCustomPropsFor).toBeInstanceOf(Function);
    expect(layer.getValidityFor).toBeInstanceOf(Function);
    expect(layer.getMessageFor).toBeInstanceOf(Function);
    expect(layer.getStatusFor).toBeInstanceOf(Function);
    expect(layer.getDomIdFor).toBeInstanceOf(Function);
    expect(layer.getFieldIdFor).toBeInstanceOf(Function);
    expect(layer.handleChange).toBeInstanceOf(Function);
    expect(layer.handleBlur).toBeInstanceOf(Function);
    expect(layer.handleSubmit).toBeInstanceOf(Function);

    expect(Object.keys(layer).length).toBe(15);
    expect(Object.keys(layer.__fields).length).toBe(2);
  });
});
