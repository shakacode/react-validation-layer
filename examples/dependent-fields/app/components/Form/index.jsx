import React, { PropTypes } from 'react';
import classNames from 'classnames';

import styles from './styles.scss';

export default class Form extends React.Component {

  static propTypes = {
    form: PropTypes.shape({
      getPropsFor: PropTypes.func.isRequired,
      getStatusFor: PropTypes.func.isRequired,
      getDomIdFor: PropTypes.func.isRequired,
      handleSubmit: PropTypes.func.isRequired,
    }),
  };

  getClassNamesFor(field) {
    const { form } = this.props;

    return classNames(
      styles.field,
      styles[form.getStatusFor(field)]
    );
  }

  render() {
    const { form } = this.props;

    return (
      <form className={styles.form} onSubmit={form.handleSubmit}>

        <div className={this.getClassNamesFor('email')}>
          <label htmlFor={form.getDomIdFor('email')}>
            Email
          </label>
          <input
            type="text"
            {...form.getPropsFor('email')}
          />
          <span className={styles.message}>
            {form.getMessageFor('email')}
          </span>
        </div>

        <div className={this.getClassNamesFor('password')}>
          <label htmlFor={form.getDomIdFor('password')}>
            Password
          </label>
          <input
            type="text"
            {...form.getPropsFor('password')}
          />
          <span className={styles.message}>
            {form.getMessageFor('password')}
          </span>
        </div>

        <div className={this.getClassNamesFor('passwordConfirmation')}>
          <label htmlFor={form.getDomIdFor('passwordConfirmation')}>
            Password Confirmation
          </label>
          <input
            type="text"
            {...form.getPropsFor('passwordConfirmation')}
          />
          <span className={styles.message}>
            {form.getMessageFor('passwordConfirmation')}
          </span>
        </div>

        <div className={styles.button}>
          <button>Submit</button>
        </div>

      </form>
    );
  }

}
