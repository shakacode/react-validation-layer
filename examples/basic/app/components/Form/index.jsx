import React, { PropTypes } from 'react';
import classNames           from 'classnames';

import styles from './styles.scss';

export default class Form extends React.Component {

  static propTypes = {
    form: PropTypes.shape({
      getPropsFor : PropTypes.func.isRequired,
      getStatusFor: PropTypes.func.isRequired,
      getDomIdFor : PropTypes.func.isRequired,
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

        <div className={this.getClassNamesFor('title')}>
          <label htmlFor={form.getDomIdFor('title')}>
            Title
          </label>
          <input
            type="text"
            {...form.getPropsFor('title')}
          />
          <span className={styles.message}>
            {form.getMessageFor('title')}
          </span>
        </div>

        <div className={this.getClassNamesFor('content')}>
          <label
            htmlFor={form.getDomIdFor('content')}
            className={styles.verticalAlignTop}
          >
            Content
          </label>
          <textarea
            rows="5"
            {...form.getPropsFor('content')}
          />
          <span className={classNames(styles.message, styles.verticalAlignTop)}>
            {form.getMessageFor('content')}
          </span>
        </div>

        <div className={styles.button}>
          <button>Submit</button>
        </div>

      </form>
    );
  }

}
