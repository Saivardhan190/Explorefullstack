/**
 * Converts a dollar amount (potentially a float) to cents (integer) robustly.
 * Handles potential floating-point inaccuracies.
 * @param {number} amount - The amount in dollars.
 * @returns {number} The amount in cents as an integer.
 */
const convertToCents = (amount) => {
  // Multiply by 100 and add a small epsilon to counteract floating point issues
  const cents = Number(amount) * 100 + Number.EPSILON;
  // Round to the nearest integer
  return Math.round(cents);
};

module.exports = {
  convertToCents,
};

