// @ts-check

/**
 * Checks if a value is an {@link ExtractableFile extractable file}.
 * @param {unknown} value Value to check.
 * @returns {value is ExtractableFile} Is the value an
 *   {@link ExtractableFile extractable file}.
 */
export default function isExtractableFile(value) {
  return (
    (typeof File !== "undefined" && value instanceof File) ||
    (typeof Blob !== "undefined" && value instanceof Blob)
  );
}

/**
 * An extractable file.
 * @typedef {File | Blob} ExtractableFile
 */
