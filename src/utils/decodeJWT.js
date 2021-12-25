/**
 * Returns whether `token` is a JWT token
 * https://www.regextester.com/105777
 * @param {string} token token to check
 * @returns {boolean} `true` if `token` matches a JWT token. otherwise `false`
 */
const isJWTToken = (token) =>
  /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/.test(token);

/**
 * Returns the payload of `jwtToken`.
 * @param {string} jwtToken JWT token
 * @returns {Record<string, unknown>} Payload of `jwtToken`
 */
const decodeJWT = (jwtToken) => {
  if (!isJWTToken(jwtToken)) {
    return {};
  }

  const [_header, payload, _signature] = jwtToken.split('.');

  console.log(_header, _signature);

  try {
    return JSON.parse(Buffer.from(payload, 'base64'));
  } catch (e) {
    console.warn(e);
    return {};
  }
};

export default decodeJWT;
