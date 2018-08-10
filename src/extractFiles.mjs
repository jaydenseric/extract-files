import { isObject } from './isObject'
import { ReactNativeFile } from './ReactNativeFile'

/**
 * String notation for the path to a node in an object tree.
 * @kind typedef
 * @name ObjectPath
 * @type {String}
 * @see [`object-path` on npm](https://npm.im/object-path).
 * @example <caption>Object path is property `a`, array index `0`, object property `b`.</caption>
 * ```
 * a.0.b
 * ```
 */

/**
 * An extracted file.
 * @kind typedef
 * @name ExtractedFile
 * @type {Object}
 * @prop {ObjectPath} path Object path to the file in the original object tree.
 * @prop {File|Blob|ReactNativeFile} file The extracted file.
 */

/**
 * Reversibly extracts [`File`](https://developer.mozilla.org/docs/web/api/file),
 * [`Blob`](https://developer.mozilla.org/docs/web/api/blob)
 * and [`ReactNativeFile`]{@link ReactNativeFile} instances, with
 * [object paths]{@link ObjectPath}, from an object tree and replaces them with
 * `null`. [`FileList`](https://developer.mozilla.org/docs/web/api/filelist)
 * instances are treated as [`File`](https://developer.mozilla.org/docs/web/api/file)
 * instance arrays.
 * @kind function
 * @name extractFiles
 * @param {Object} tree An object tree to extract files from. The tree itself must not be a file.
 * @param {string} [treePath=''] Optional object tree path to prefix file object tree paths.
 * @returns {ExtractedFile[]} Extracted files or an empty array if the tree is not an enumerable object.
 * @example <caption>Extracting files.</caption>
 * The following:
 *
 * ```js
 * import { extractFiles } from 'extract-files'
 *
 * console.log(
 *   extractFiles(
 *     {
 *       a: new File(['a'], 'a.txt', { type: 'text/plain' }),
 *       b: [
 *         {
 *           c: new File(['b'], 'b.txt', { type: 'text/plain' })
 *         }
 *       ]
 *     },
 *     'prefix'
 *   )
 * )
 * ```
 *
 * Logs:
 *
 * ```
 * [{
 *   path: 'prefix.a',
 *   file: [object File]
 * }, {
 *   path: 'prefix.b.0.c',
 *   file: [object File]
 * }]
 * ```
 */
export function extractFiles(tree, treePath = '') {
  const files = []

  /**
   * Recursively extracts files from an object tree node.
   * @kind function
   * @name extractFiles~recurse
   * @param {Object} node Object tree node.
   * @param {ObjectPath} nodePath Object tree node path.
   * @ignore
   */
  const recurse = (node, nodePath) => {
    // Iterate enumerable properties of the node.
    Object.keys(node).forEach(key => {
      // Skip non-object.
      if (!isObject(node[key])) return

      const path = `${nodePath}${key}`

      if (
        // Node is a File.
        (typeof File !== 'undefined' && node[key] instanceof File) ||
        // Node is a Blob.
        (typeof Blob !== 'undefined' && node[key] instanceof Blob) ||
        // Node is a ReactNativeFile.
        node[key] instanceof ReactNativeFile
      ) {
        // Extract the file and it's object tree path.
        files.push({ path, file: node[key] })

        // Delete the file. Array items must be deleted without reindexing to
        // allow repopulation in a reverse operation.
        node[key] = null

        // No further checks or recursion.
        return
      }

      if (typeof FileList !== 'undefined' && node[key] instanceof FileList)
        // Convert read-only FileList to an array for manipulation.
        node[key] = Array.prototype.slice.call(node[key])

      // Recurse into child node.
      recurse(node[key], `${path}.`)
    })
  }

  if (isObject(tree))
    // Recurse object tree.
    recurse(
      tree,
      // If an object tree path was provided, append a dot.
      treePath === '' ? treePath : `${treePath}.`
    )

  return files
}
