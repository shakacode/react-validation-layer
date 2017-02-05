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
        message: `${PASSWORD_MIN_LENGTH}+ characters, please`,
      };
    }

    if (password.length < PASSWORD_STRONG_LENGTH) {
      return {
        valid: true,
        status: 'weak',
        message: "Can be stronger, but it's fine",
      };
    }

    return {
      valid: true,
      message: 'Nice!',
    };
  },
}
