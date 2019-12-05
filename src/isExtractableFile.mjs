import { ReactNativeFile } from './ReactNativeFile.mjs'

/**
 * Checks if a value is an [extractable file]{@link ExtractableFile}.
 * @kind function
 * @name isExtractableFile
 * @type {ExtractableFileMatcher}
 * @param {*} value Value to check.
 * @returns {boolean} Is the value an [extractable file]{@link ExtractableFile}.
 * @example <caption>How to import.</caption>
 * ```js
 * import { isExtractableFile } from 'extract-files'
 * ```
 */
export const isExtractableFile = value =>
  (typeof File !== 'undefined' && value instanceof File) ||
  (typeof Blob !== 'undefined' && value instanceof Blob) ||
  value instanceof ReactNativeFile
