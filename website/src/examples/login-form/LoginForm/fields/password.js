export default {
  attr: 'password',
  validate: password => !!password || {
    valid: false,
    message: 'Password is required',
  },
}
