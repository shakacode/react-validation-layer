/* @flow */

const EMAIL_REGEX = /.*@.*\..+/;

export const validatePresenceAndShapeWithBoolOutput =
  (): { validate: (email: ?string) => boolean } => ({
    validate: email => !!email && EMAIL_REGEX.test(email),
  });

export const validatePresenceWithMessage =
  <M: string>(message: M): {
    validate: (email: ?string) => boolean | { valid: boolean, message: M },
  } => ({
    validate: email => !!email || { valid: false, message },
  });

export const validatePresenceAndShapeWithMessages =
  <P: string, S: string>({ presence, shape }: { presence: P, shape: S }): {
    validate: (email: ?string) => boolean | { valid: boolean, message: P | S },
  } => ({
    validate: email => {
      if (!email) return { valid: false, message: presence };
      if (!EMAIL_REGEX.test(email)) return { valid: false, message: shape };
      return true;
    },
  });
