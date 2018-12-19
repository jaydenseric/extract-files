import { ReactNativeFile } from './ReactNativeFile'

/**
 * Clones a value, recursively extracting
 * [`File`](https://developer.mozilla.org/docs/web/api/file),
 * [`Blob`](https://developer.mozilla.org/docs/web/api/blob) and
 * [`ReactNativeFile`]{@link ReactNativeFile} instances with their
 * [object paths]{@link ObjectPath}, replacing them with `null`.
 * [`FileList`](https://developer.mozilla.org/docs/web/api/filelist) instances
 * are treated as [`File`](https://developer.mozilla.org/docs/web/api/file)
 * instance arrays.
 * @kind function
 * @name extractFiles
 * @param {*} value Value (typically an object tree) to extract files from.
 * @param {string} [path=''] Root path to prefix object paths for extracted files.
 * @returns {ExtractFilesResult} Result.
 * @example <caption>Extracting files.</caption>
 * The following:
 *
 * ```js
 * import { extractFiles } from 'extract-files'
 *
 * const file1 = new File(['1'], '1.txt', { type: 'text/plain' })
 * const file2 = new File(['2'], '2.txt', { type: 'text/plain' })
 *
 * console.log(extractFiles({ a: file1, b: [{ a: file2 }] }, 'prefix'))
 * ```
 *
 * Logs:
 *
 * ```
 * [{
 *   path: 'prefix.a',
 *   file: [object File]
 * }, {
 *   path: 'prefix.b.0.a',
 *   file: [object File]
 * }]
 * ```
 */
export function extractFiles(value, path = '') {
  if (
    (typeof File !== 'undefined' && value instanceof File) ||
    (typeof Blob !== 'undefined' && value instanceof Blob) ||
    value instanceof ReactNativeFile
  )
    return { clone: null, files: [{ path, file: value }] }

  const prefix = path ? `${path}.` : ''
  const files = []

  if (typeof FileList !== 'undefined' && value instanceof FileList)
    return Array.prototype.reduce.call(
      value,
      (result, file, i) => {
        result.clone[i] = null
        result.files.push({ path: `${prefix}${i}`, file })
        return result
      },
      { clone: [], files }
    )

  if (Array.isArray(value))
    return value.reduce(
      (result, child, i) => {
        const { clone, files } = extractFiles(child, `${prefix}${i}`)
        result.clone[i] = clone
        result.files.push(...files)
        return result
      },
      { clone: [], files }
    )

  if (value && typeof value == 'object') {
    const clone = {}
    for (const i in value) {
      const result = extractFiles(value[i], `${prefix}${i}`)
      clone[i] = result.clone
      files.push(...result.files)
    }
    return { clone, files }
  }

  return { clone: value, files }
}
