export function password(value) {
  if (!value) {
    return {
      valid: false,
      message: 'Password is required',
    };
  }

  if (value.length > 0 && value.length < 3) {
    return {
      valid: false,
      message: 'Password is too short',
    };
  }

  if (value.length >= 3 && value.length < 5) {
    return {
      valid: true,
      status: 'weak',
      message: 'Guess it\'s ok...',
    };
  }

  return {
    valid: true,
    message: 'Nice one!',
  };
}
