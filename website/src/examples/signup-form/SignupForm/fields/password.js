const PASSWORD_MIN_LENGTH = 4;
const PASSWORD_STRONG_LENGTH = 6;

export default {
  linkedFields: ['passwordConfirmation'],

  validate: (password) => {
    if (!password) {
      return {
        valid: false,
        message: 'Password is required',
      };
    }

    if (password.length < PASSWORD_MIN_LENGTH) {
      return {
        valid: false,
        message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters length`,
      };
    }

    if (password.length < PASSWORD_STRONG_LENGTH) {
      return {
        valid: true,
        status: 'weak',
        message: 'Not really strong one, but should be fine',
      };
    }

    return {
      valid: true,
      message: 'Nice!',
    };
  },
}
