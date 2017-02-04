const TAKEN_EMAIL = 'taken@email.test';

export default {
  validateEmail: (email) => new Promise((resolve, reject) => {
    setTimeout(() =>
      email === TAKEN_EMAIL
      ? resolve({ ok: false })
      : resolve({ ok: true })
    , 1000);
  }),
};
