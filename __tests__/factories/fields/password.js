/* @flow */

const PASSWORD_MIN_LENGTH = 4;

export const validatePresenceAndLengthWithBoolOutput =
  (): { validate: (password: ?string) => boolean } => ({
    validate: password => !!password && password.length >= PASSWORD_MIN_LENGTH,
  });

export const validatePresenceWithMessage =
  <M: string>(message: M): {
    validate: (password: ?string) => boolean | { valid: boolean, message: M },
  } => ({
    validate: password => !!password || { valid: false, message },
  });

export const validatePresenceAndLengthWithMessages =
  <P: string, L: string>({ presence, length }: { presence: P, length: L }): {
    validate: (password: ?string) => boolean | { valid: false, message: P | L },
  } => ({
    validate: password => {
      if (!password) return { valid: false, message: presence };
      if (password.length < PASSWORD_MIN_LENGTH) return { valid: false, message: length };
      return true;
    },
  });
