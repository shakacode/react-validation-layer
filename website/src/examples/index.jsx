/* @flow */

import React from 'react';
import { Match } from 'react-router'

import LoginForm from './login-form';
import SignupForm from './signup-form';


const Examples = (props) => (
  <section className="section">
    <Match pattern="/examples/login-form" component={LoginForm} />
    <Match pattern="/examples/signup-form" component={SignupForm} />
  </section>
);

export default Examples;
