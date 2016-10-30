export function email(value) {
  if (!value) {
    return {
      valid: false,
      message: 'Email is required',
    };
  }

  if (!/^.+@.+\..+$/i.test(value)) {
    return {
      valid: false,
      message: 'Looks like it\'s not email',
    };
  }

  return {
    valid: true,
    message: 'Nice one!',
  };
}
