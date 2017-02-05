import api from '../api';

const EMAIL_REGEX = /.*@.*\..+/;

export default {
  validate: (email) => {
    if (!email) {
      return {
        valid: false,
        message: 'Email is required',
      };
    }

    if (!EMAIL_REGEX.test(email)) {
      return {
        valid: false,
        message: 'Email is invalid',
      };
    }

    return true;
  },


  validateAsync: (email) => new Promise((resolve, reject) => {
    console.log('Async validation of `email` is triggered w/ value:', email);

    api
      .validateEmail(email)
      .then(res => (
        res.ok
        ? resolve({ valid: true, message: 'Nice!' })
        : resolve({ valid: false, message: 'Email is alredy taken' })
      ))
  })
}
