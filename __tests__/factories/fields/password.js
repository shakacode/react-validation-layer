const PASSWORD_MIN_LENGTH = 4;

export const noValidation = () => ({ attr: 'password' });

export const validatePresenceAndLengthWithBoolOutput = () => ({
  attr: 'password',
  validate: password => !!password && password.length >= PASSWORD_MIN_LENGTH,
});

export const validatePresenceWithMessage = (message) => ({
  attr: 'password',
  validate: password => !!password || { valid: false, message },
});

export const validatePresenceAndLengthWithMessages = ({ presence, length }) => ({
  attr: 'password',
  validate: password => {
    if (!password) return { valid: false, message: presence };
    if (password.length < PASSWORD_MIN_LENGTH) return { valid: false, message: length };
    return true;
  },
});
