import React, { PropTypes } from 'react';
import ValidationLayer from 'react-validation-layer';

import Form from '../components/Form';
import * as validators from '../validators';

export default class FormContainer extends React.Component {

  static propTypes = {
    loginData: PropTypes.shape({
      email: PropTypes.string,
      password: PropTypes.string,
      passwordConfirmation: PropTypes.string,
    }).isRequired,
    updateFormState: PropTypes.func.isRequired,
  };

  getFormFields() {
    return [
      {
        attr: 'email',
        validate: validators.email,
        feedbackStrategy: 'onSuccessOrFirstBlur',
      },
      {
        attr: 'password',
        validate: validators.password,
        feedbackStrategy: 'instantTouchedOnly',
      },
      {
        attr: 'passwordConfirmation',
        validate: validators.passwordConfirmation,
        feedbackStrategy: 'instantTouchedOnly',
      },
    ];
  }

  handleSubmit() {
    // eslint-disable-next-line no-alert, no-undef
    window.alert('Form is valid and submitted!');
  }

  render() {
    const { props } = this;

    return (
      <ValidationLayer
        {...this.props}
        dataKey="loginData"
        fields={this.getFormFields()}
        handlers={{
          onChange: props.updateFormState,
          onSubmit: this.handleSubmit,
        }}
      >
        {form => <Form {...{ form }} />}
      </ValidationLayer>
    );
  }

}
