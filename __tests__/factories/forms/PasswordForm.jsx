/* eslint-disable react/prop-types */

import React from 'react';
import classNames from 'classnames';
import { mount, shallow } from 'enzyme';

import { mockLayerProps, printValidity } from '../../helpers';

import ValidationLayer from '../../../src';

const PasswordForm = (layerProps) => (
  <ValidationLayer {...mockLayerProps(layerProps)}>
    {layer => (
      <form className="form" onSubmit={layer.handleSubmit}>
        <div className={classNames('password-wrapper', layer.getStatusFor('password'))}>
          <input
            type="text"
            className="password-input"
            {...layer.getPropsFor('password')}
          />
          {
            layer.getMessageFor('password') &&
            <span className="password-message">
              {layer.getMessageFor('password')}
            </span>
          }
          <div className="password-validity">
            {printValidity(layer.getValidityFor('password'))}
          </div>
        </div>
      </form>
    )}
  </ValidationLayer>
);

/* eslint-disable new-cap */
export const mountPasswordForm = (...args) => mount(PasswordForm(...args));
export const shallowRenderPasswordForm = (...args) => shallow(PasswordForm(...args));
