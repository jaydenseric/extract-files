import { ReactNativeFile } from './ReactNativeFile'

/**
 * Default [`IsFileValueFunction`]{@link IsFileValueFunction} for checking if a given value is a file.
 * @kind function
 * @name isFileValue
 * @param {*} value Value that will be checked
 * @returns {boolean} Result.
 */
export function isFileValue(value) {
  return (
    (typeof File !== 'undefined' && value instanceof File) ||
    (typeof Blob !== 'undefined' && value instanceof Blob) ||
    value instanceof ReactNativeFile
  )
}
