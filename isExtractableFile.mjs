// @ts-check

import ReactNativeFile from "./ReactNativeFile.mjs";

/**
 * Checks if a value is an {@link ExtractableFile extractable file}.
 * @param {unknown} value Value to check.
 * @returns {value is ExtractableFile} Is the value an
 *   {@link ExtractableFile extractable file}.
 */
export default function isExtractableFile(value) {
  return (
    (typeof File !== "undefined" && value instanceof File) ||
    (typeof Blob !== "undefined" && value instanceof Blob) ||
    value instanceof ReactNativeFile
  );
}

/**
 * An extractable file.
 * @typedef {File | Blob | ReactNativeFile} ExtractableFile
 */
