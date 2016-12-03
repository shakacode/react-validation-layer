/* @flow */

import React from 'react';
import { Match } from 'react-router'

import LoginForm from './login-form';


const Examples = (props) => (
  <section className="section">
    <Match pattern="/examples/login-form" component={LoginForm} />
  </section>
);

export default Examples;
