import React from 'react';

import FormContainer from './FormContainer';

export default class AppContainer extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      email: null,
      password: null,
      passwordConfirmation: null,
    };

    this.updateFormState = this.updateFormState.bind(this);
  }

  updateFormState(nextData) {
    this.setState({ [nextData.attr]: nextData.value });
  }

  render() {
    return (
      <FormContainer
        loginData={this.state}
        updateFormState={this.updateFormState}
      />
    );
  }

}
