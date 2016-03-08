import React, { PropTypes } from 'react';
import ValidationLayer      from 'react-validation-layer';

import Form            from '../components/Form';
import * as validators from '../validators';

export default class FormContainer extends React.Component {

  static propTypes = {
    loginData: PropTypes.shape({
      email               : PropTypes.string,
      password            : PropTypes.string,
      passwordConfirmation: PropTypes.string,
    }).isRequired,
    updateFormState: PropTypes.func.isRequired,
  };

  getFormFields() {
    return [
      {
        attr    : 'email',
        validate: validators.email,
      },
      {
        attr    : 'password',
        validate: validators.password,
      },
      {
        attr    : 'passwordConfirmation',
        validate: validators.passwordConfirmation,
      },
    ];
  }

  handleSubmit() {
    window.alert('Form is valid and submitted!');
  }

  render() {
    const { props } = this;

    return (
      <ValidationLayer
        {...this.props}
        dataKey="loginData"
        feedbackStrategy="onSuccessOrFirstBlur"
        fields={this.getFormFields()}
        onSubmit={this.handleSubmit}
        handlers={{ onChange: props.updateFormState }}
      >
        <Form {...this.props} />
      </ValidationLayer>
    );
  }

}
