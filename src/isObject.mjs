/**
 * Checks a value is an enumerable object.
 * @kind function
 * @name isObject
 * @param {*} value A value to check.
 * @returns {boolean} Is the value an enumerable object.
 * @ignore
 */
export const isObject = value => typeof value === 'object' && value !== null
