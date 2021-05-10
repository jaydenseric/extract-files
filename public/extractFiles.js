'use strict';

const defaultIsExtractableFile = require('./isExtractableFile.js');

/**
 * Clones a value, recursively extracting
 * [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File),
 * [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) and
 * [`ReactNativeFile`]{@link ReactNativeFile} instances with their
 * [object paths]{@link ObjectPath}, replacing them with `null`.
 * [`FileList`](https://developer.mozilla.org/en-US/docs/Web/API/Filelist) instances
 * are treated as [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File)
 * instance arrays.
 * @kind function
 * @name extractFiles
 * @param {*} value Value (typically an object tree) to extract files from.
 * @param {ObjectPath} [path=''] Prefix for object paths for extracted files.
 * @param {ExtractableFileMatcher} [isExtractableFile=isExtractableFile] The function used to identify extractable files.
 * @returns {ExtractFilesResult} Result.
 * @example <caption>Ways to `import`.</caption>
 * ```js
 * import { extractFiles } from 'extract-files';
 * ```
 *
 * ```js
 * import extractFiles from 'extract-files/public/extractFiles.js';
 * ```
 * @example <caption>Ways to `require`.</caption>
 * ```js
 * const { extractFiles } = require('extract-files');
 * ```
 *
 * ```js
 * const extractFiles = require('extract-files/public/extractFiles.js');
 * ```
 * @example <caption>Extract files from an object.</caption>
 * For the following:
 *
 * ```js
 * const file1 = new File(['1'], '1.txt', { type: 'text/plain' });
 * const file2 = new File(['2'], '2.txt', { type: 'text/plain' });
 * const value = {
 *   a: file1,
 *   b: [file1, file2],
 * };
 *
 * const { clone, files } = extractFiles(value, 'prefix');
 * ```
 *
 * `value` remains the same.
 *
 * `clone` is:
 *
 * ```json
 * {
 *   "a": null,
 *   "b": [null, null]
 * }
 * ```
 *
 * `files` is a [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) instance containing:
 *
 * | Key     | Value                        |
 * | :------ | :--------------------------- |
 * | `file1` | `['prefix.a', 'prefix.b.0']` |
 * | `file2` | `['prefix.b.1']`             |
 */
module.exports = function extractFiles(
  value,
  path = '',
  isExtractableFile = defaultIsExtractableFile
) {
  let clone;
  const files = new Map();

  /**
   * Adds a file to the extracted files map.
   * @kind function
   * @name extractFiles~addFile
   * @param {Array<ObjectPath>} paths File object paths.
   * @param {ExtractableFile} file Extracted file.
   * @ignore
   */
  function addFile(paths, file) {
    const storedPaths = files.get(file);
    if (storedPaths) storedPaths.push(...paths);
    else files.set(file, paths);
  }

  if (isExtractableFile(value)) {
    clone = null;
    addFile([path], value);
  } else {
    const prefix = path ? `${path}.` : '';

    if (typeof FileList !== 'undefined' && value instanceof FileList)
      clone = Array.prototype.map.call(value, (file, i) => {
        addFile([`${prefix}${i}`], file);
        return null;
      });
    else if (Array.isArray(value))
      clone = value.map((child, i) => {
        const result = extractFiles(child, `${prefix}${i}`, isExtractableFile);
        result.files.forEach(addFile);
        return result.clone;
      });
    else if (value && value.constructor === Object) {
      clone = {};
      for (const i in value) {
        const result = extractFiles(
          value[i],
          `${prefix}${i}`,
          isExtractableFile
        );
        result.files.forEach(addFile);
        clone[i] = result.clone;
      }
    } else clone = value;
  }

  return { clone, files };
};
