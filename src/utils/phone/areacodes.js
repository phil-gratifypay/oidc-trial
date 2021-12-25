/**
 * @typedef {{
 *  text: string,
 *  code: string,
 *  country: string,
 *  placeholder: string,
 *  mask: string,
 *  removeFirstZero: boolean,
 * }} Areacode
 */

/**
 * @type {Areacode}
 */
export default [
  {
    text: "+1",
    code: "ca",
    country: "Canada",
    mask: "(###) ###-####",
    placeholder: "(555) 555-5554",
    removeFirstZero: false,
  },
  {
    text: "+1",
    code: "us",
    country: "United States of America",
    mask: "(###) ###-####",
    placeholder: "(555) 555-5554",
    removeFirstZero: false,
  },
  {
    text: "+61",
    code: "au",
    country: "Australia",
    mask: "#### ### ###",
    placeholder: "0455 555 555",
    removeFirstZero: true,
  },
  {
    text: "+64",
    code: "nz",
    country: "New Zealand",
    mask: "(###) ###-####",
    placeholder: "(024) 555-5554",
    removeFirstZero: true,
  },
  {
    text: "+44",
    code: "gb",
    country: "United Kingdom",
    mask: "##### ### ###",
    placeholder: "07915 554 555",
    removeFirstZero: true,
  },
];
