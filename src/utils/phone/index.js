import areacodes from "./areacodes";
import isMobilePhone from "validator/es/lib/isMobilePhone";

/**
 * Checks if a phone number in the form of `+${areacode}${phoneNumber}` is
 * valid.
 *
 * @param {string} phoneNumber
 */
const isValidPhoneNumber = (phoneNumber) => {
  return isMobilePhone(phoneNumber, "any", {
    strictMode: true,
  });
};

export { areacodes, isValidPhoneNumber };
