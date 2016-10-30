export function passwordConfirmation(value, props) {
  if (!value) {
    return {
      valid: false,
      message: 'Password confirmation is required',
    };
  }

  if (value !== props.loginData.password) {
    return {
      valid: false,
      message: 'Passwords doesn\'t match',
    };
  }

  return {
    valid: true,
    message: 'Perfect match!',
  };
}
