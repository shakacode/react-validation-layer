/* @flow */
/* eslint-disable react/prop-types */

import React from 'react';
import classNames from 'classnames';
import { mount } from 'enzyme';

import type { Data, Fields, Strategy } from '../../../src/types';

import { mockStrictLayerProps } from '../../helpers';

import ValidationLayer from '../../../src';


const defaultData = { frequency: null, permit: null };
const defaultFields = { frequency: true, permit: true };

type Props = {
  id?: string,
  data?: Data,
  fields?: Fields,
  strategy?: Strategy,
};

const SubscriptionForm = ({
  strategy,
  id = 'subscriptionForm',
  data = defaultData,
  fields = defaultFields,
}: Props) => (
  <ValidationLayer {...mockStrictLayerProps({ strategy, id, data, fields })}>
    {layer => (
      <form className="form" onSubmit={layer.handleSubmit}>
        <div className={classNames('frequency-wrapper', layer.getStatusFor('frequency'))}>
          <input
            type="radio"
            className="frequency-radio-weekly"
            {...layer.getRadioButtonPropsFor('frequency', 'weekly')}
          />
          <input
            type="radio"
            className="frequency-radio-monthly"
            {...layer.getRadioButtonPropsFor('frequency', 'monthly')}
          />
        </div>
        <div className={classNames('permit-wrapper', layer.getStatusFor('permit'))}>
          <input
            type="checkbox"
            className="permit-checkbox"
            {...layer.getCheckboxPropsFor('permit')}
          />
        </div>
        <div className="submit-button-wrapper">
          <button
            {...layer.getSubmitButtonProps()}
            className="submit-button"
          >
            Submit
          </button>
        </div>
      </form>
    )}
  </ValidationLayer>
);

/* eslint-disable new-cap */
export const mountSubscriptionForm = (...args: Array<Props>): * => mount(SubscriptionForm(...args));
