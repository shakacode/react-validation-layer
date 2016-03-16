import React, { PropTypes } from 'react';
import classNames           from 'classnames';

import styles from './styles.scss';

export default class Form extends React.Component {

  static propTypes = {
    formFields: PropTypes.shape({
      getPropsFor : PropTypes.func.isRequired,
      getStatusFor: PropTypes.func.isRequired,
      getDomIdFor : PropTypes.func.isRequired,
    }),

    formHandlers: PropTypes.shape({
      handleSubmit: PropTypes.func.isRequired,
    }),
  };

  getClassNamesFor(field) {
    const { formFields } = this.props;

    return classNames(
      styles.field,
      styles[formFields.getStatusFor(field)]
    );
  }

  render() {
    const { formFields, formHandlers } = this.props;

    return (
      <form className={styles.form} onSubmit={formHandlers.handleSubmit}>

        <div className={this.getClassNamesFor('email')}>
          <label htmlFor={formFields.getDomIdFor('email')}>
            Email
          </label>
          <input
            type="text"
            {...formFields.getPropsFor('email')}
          />
          <span className={styles.message}>
            {formFields.getMessageFor('email')}
          </span>
        </div>

        <div className={this.getClassNamesFor('password')}>
          <label htmlFor={formFields.getDomIdFor('password')}>
            Password
          </label>
          <input
            type="text"
            {...formFields.getPropsFor('password')}
          />
          <span className={styles.message}>
            {formFields.getMessageFor('password')}
          </span>
        </div>

        <div className={this.getClassNamesFor('passwordConfirmation')}>
          <label htmlFor={formFields.getDomIdFor('passwordConfirmation')}>
            Password Confirmation
          </label>
          <input
            type="text"
            {...formFields.getPropsFor('passwordConfirmation')}
          />
          <span className={styles.message}>
            {formFields.getMessageFor('passwordConfirmation')}
          </span>
        </div>

        <div className={styles.button}>
          <button>Submit</button>
        </div>

      </form>
    );
  }

}
