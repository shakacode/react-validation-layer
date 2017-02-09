export default {
  validate: password => {
    if (!password) {
      return {
        valid: false,
        message: 'Password is required',
      };
    }

    return {
      valid: true,
      message: 'Nice!',
    };
  },
}
