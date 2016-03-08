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

        <div className={this.getClassNamesFor('title')}>
          <label htmlFor={formFields.getDomIdFor(['title'])}>
            Title
          </label>
          <input
            type="text"
            {...formFields.getPropsFor('title')}
          />
          <span className={styles.message}>
            {formFields.getMessageFor('title')}
          </span>
        </div>

        <div className={this.getClassNamesFor('content')}>
          <label
            htmlFor={formFields.getDomIdFor(['content'])}
            className={styles.verticalAlignTop}
          >
            Content
          </label>
          <textarea
            rows="5"
            {...formFields.getPropsFor('content')}
          />
          <span className={classNames(styles.message, styles.verticalAlignTop)}>
            {formFields.getMessageFor('content')}
          </span>
        </div>

        <div className={styles.button}>
          <button>Submit</button>
        </div>

      </form>
    );
  }

}
