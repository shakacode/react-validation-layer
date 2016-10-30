import React, { PropTypes } from 'react';
import ValidationLayer from 'react-validation-layer';

import Form from '../components/Form';

export default class FormContainer extends React.Component {

  static propTypes = {
    articleData: PropTypes.shape({
      title: PropTypes.string,
      content: PropTypes.string,
    }).isRequired,
    updateFormState: PropTypes.func.isRequired,
  };

  getFormFields() {
    return [
      {
        attr: 'title',
        validate: this.validateTitle,
      },
      {
        attr: 'content',
        validate: this.validateContent,
      },
    ];
  }

  validateTitle(value) {
    if (!value) {
      return {
        valid: false,
        message: 'Title is required',
      };
    }

    return true;
  }

  validateContent(value) {
    if (!value) {
      return {
        valid: false,
        message: 'Content is required',
      };
    }

    return true;
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
        dataKey="articleData"
        feedbackStrategy="onSubmit"
        fields={this.getFormFields()}
        handlers={{
          onChange: props.updateFormState,
          onSubmit: this.handleSubmit,
        }}
      >
        <Form />
      </ValidationLayer>
    );
  }

}
