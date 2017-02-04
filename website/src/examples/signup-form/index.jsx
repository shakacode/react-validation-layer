import React, { Component } from 'react';

import SignupForm from './SignupForm';


export default class SignupFormContainer extends Component {

  state = {
    email: null,
    password: null,
    passwordConfirmation: null,
  };

  updateFormState = ({ attr, value }) => {
    this.setState({ [attr]: value });
  };

  submitForm = ({ onSuccess }) => {
    this.setState({
      email: null,
      password: null,
      passwordConfirmation: null,
    }, onSuccess);
  };

  render() {
    return (
      <SignupForm
        signupData={this.state}
        updateFormState={this.updateFormState}
        submitForm={this.submitForm}
      />
    );
  }
}
