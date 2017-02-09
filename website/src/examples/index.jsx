/* @flow */

import React from 'react';
import { Route } from 'react-router-dom'

import LoginForm from './login-form';
import SignupForm from './signup-form';


const Examples = (props) => (
  <section className="section">
    <Route path="/examples/login-form" component={LoginForm} />
    <Route path="/examples/signup-form" component={SignupForm} />
  </section>
);

export default Examples;
