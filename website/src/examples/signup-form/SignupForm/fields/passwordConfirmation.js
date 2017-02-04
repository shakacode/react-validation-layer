export default {
  validate: (passwordConfirmation, data) => {
    if (!passwordConfirmation) {
      return {
        valid: false,
        message: 'Password confirmation is required',
      };
    }

    if (passwordConfirmation !== data.password) {
      return {
        valid: false,
        message: "Password doesn't match",
      };
    }

    return {
      valid: true,
      message: 'Match!',
    };
  },
}
