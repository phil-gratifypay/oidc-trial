import { conformToMask } from "text-mask-core";
/**
 *
 * @param {string} pattern string pattern
 */
const patternToMask = (pattern) => {
  let isPreviousCharBackSlash = false;

  return [...pattern]
    .map((p) => {
      switch (p) {
        case "#": {
          if (isPreviousCharBackSlash) {
            isPreviousCharBackSlash = false;
            return "#";
          }

          return /\d/;
        }

        case "A": {
          if (isPreviousCharBackSlash) {
            isPreviousCharBackSlash = false;
            return "A";
          }

          return /[a-zA-Z]/;
        }

        case "N": {
          if (isPreviousCharBackSlash) {
            isPreviousCharBackSlash = false;
            return "N";
          }

          return /[0-9a-zA-Z]/;
        }

        case "X": {
          if (isPreviousCharBackSlash) {
            isPreviousCharBackSlash = false;
            return "N";
          }

          return /./;
        }

        case "\\": {
          // If the previous character is escaped then ignore this \ character
          if (isPreviousCharBackSlash) {
            isPreviousCharBackSlash = false;
            return "\\";
          }

          isPreviousCharBackSlash = true;
          return null;
        }

        default: {
          isPreviousCharBackSlash = false;
          return p;
        }
      }
    })
    .filter((mask) => mask !== null);
};

/**
 *
 * @param {string} str unformatted string
 * @param {string} pattern string of character denoting the pattern.
 * `#` denotes digit, `A` denotes any alphabet, `X` denotes any symbol,
 * and `N` denotes any alphanumeric symbol and escape those symbol with \\ (\\#)
 * @returns {string}
 */
export const formatToPattern = (str, pattern) => {
  const patternRegexes = patternToMask(pattern);

  const { conformedValue } = conformToMask(str, patternRegexes, {
    guide: false,
  });

  return conformedValue;
};
