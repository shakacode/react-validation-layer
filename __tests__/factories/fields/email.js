const EMAIL_REGEX = /.*@.*\..+/;

export const noValidation = () => ({ attr: 'email' });

export const validatePresenceAndShapeWithBoolOutput = () => ({
  attr: 'email',
  validate: email => !!email && EMAIL_REGEX.test(email),
});

export const validatePresenceWithMessage = (message) => ({
  attr: 'email',
  validate: email => !!email || { valid: false, message },
});

export const validatePresenceAndShapeWithMessages = ({ presence, shape }) => ({
  attr: 'email',
  validate: email => {
    if (!email) return { valid: false, message: presence };
    if (!EMAIL_REGEX.test(email)) return { valid: false, message: shape };
    return true;
  },
});
