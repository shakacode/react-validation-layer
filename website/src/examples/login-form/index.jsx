import React, { Component } from 'react';

import LoginForm from './LoginForm';


export default class LoginFormContainer extends Component {

  state = {
    email: null,
    password: null,
  };

  updateFormState = ({ attr, value }) => {
    this.setState({ [attr]: value });
  };

  submitForm = ({ onSuccess }) => {
    this.setState({
      email: null,
      password: null,
    }, onSuccess);
  };

  render() {
    return (
      <LoginForm
        loginData={this.state}
        updateFormState={this.updateFormState}
        submitForm={this.submitForm}
      />
    );
  }
}
