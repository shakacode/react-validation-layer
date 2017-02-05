const TAKEN_EMAIL = 'test@taken.email';

export default {
  validateEmail: (email) => new Promise((resolve, reject) => {
    setTimeout(() =>
      email === TAKEN_EMAIL
      ? resolve({ ok: false })
      : resolve({ ok: true })
    , 1000);
  }),
};
