const EMAIL_REGEX = /.*@.*\..+/;

export default {
  attr: 'email',
  validate: email => {
    if (!email) {
      return {
        valid: false,
        message: 'Email is required',
      };
    }

    if (!EMAIL_REGEX.test(email)) {
      return {
        valid: false,
        message: 'Email is invalid',
      };
    }

    return true;
  },
}
