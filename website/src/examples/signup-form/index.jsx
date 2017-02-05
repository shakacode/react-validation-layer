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
    window.alert("All good! Now I'll reset the form");
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
