/* @flow */
/* eslint-disable react/prop-types */

import React from 'react';
import classNames from 'classnames';
import { mount, shallow } from 'enzyme';

import type { TestProps } from '../../types';

import { mockStrictLayerProps, printValidity } from '../../helpers';

import ValidationLayer from '../../../src';

const PasswordForm = (layerProps: TestProps) => (
  <ValidationLayer {...mockStrictLayerProps({ id: 'passwordForm', ...layerProps })}>
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
export const mountPasswordForm =
  (...args: Array<TestProps>) => mount(PasswordForm(...args));

export const shallowRenderPasswordForm =
  (...args: Array<TestProps>) => shallow(PasswordForm(...args));
