/* @flow */

import React from 'react';
import { mount } from 'enzyme';

import LayerInterface from '../../../src/LayerInterface';

import { mockStrictLayerProps } from '../../helpers';

import ValidationLayer from '../../../src';


describe('layer', () => {
  it('contains fields data and methods', () => {
    const layerProps = mockStrictLayerProps({
      id: 'loginForm',
      strategy: 'onFirstSubmit',
      data: { email: 'my@email.com', password: 'mypassword' },
      fields: { email: true, password: true },
    });

    let layer: ?LayerInterface;

    mount(
      <ValidationLayer {...layerProps}>
        {nextLayer => {
          layer = nextLayer;
          return null;
        }}
      </ValidationLayer>,
    );

    if (!layer) throw new Error('`layer` is not defined');

    expect(layer).toBeInstanceOf(LayerInterface);

    expect(layer.__layerId).toBe('loginForm');

    expect(layer.__fields.email.props).toBeInstanceOf(Object);
    expect(layer.__fields.password.props).toBeInstanceOf(Object);

    expect(layer.__getField).toBeInstanceOf(Function);

    expect(layer.__isSubmitting).toBe(false);

    expect(layer.__handleDomBlur).toBeInstanceOf(Function);
    expect(layer.__handleDomChange).toBeInstanceOf(Function);

    expect(layer.getPropsFor).toBeInstanceOf(Function);
    expect(layer.getCheckboxPropsFor).toBeInstanceOf(Function);
    expect(layer.getRadioButtonPropsFor).toBeInstanceOf(Function);
    expect(layer.getCustomPropsFor).toBeInstanceOf(Function);
    expect(layer.getSubmitButtonProps).toBeInstanceOf(Function);
    expect(layer.getValidityFor).toBeInstanceOf(Function);
    expect(layer.isSuccessFor).toBeInstanceOf(Function);
    expect(layer.isFailureFor).toBeInstanceOf(Function);
    expect(layer.getStatusFor).toBeInstanceOf(Function);
    expect(layer.getMessageFor).toBeInstanceOf(Function);
    expect(layer.getAsyncStatusFor).toBeInstanceOf(Function);
    expect(layer.getSubmissionStatus).toBeInstanceOf(Function);
    expect(layer.getDomIdFor).toBeInstanceOf(Function);
    expect(layer.getFieldIdFor).toBeInstanceOf(Function);
    expect(layer.notifyOnChange).toBeInstanceOf(Function);
    expect(layer.notifyOnBlur).toBeInstanceOf(Function);
    expect(layer.handleSubmit).toBeInstanceOf(Function);

    expect(Object.keys(layer).length).toBe(23);
    expect(Object.keys(layer.__fields).length).toBe(2);
  });
});
