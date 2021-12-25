/**
 * Returns whether `email` is a valid email format.
 * @param {string} email email to test
 * @returns {boolean}
 */
export const isValidEmail = (email) =>
  /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email);

export default isValidEmail;
