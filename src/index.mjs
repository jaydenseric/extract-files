/**
 * A React Native `window.File` substitute when using `FormData`.
 * @kind typedef
 * @name ReactNativeFileSubstitute
 * @type {Object}
 * @see [React Native `FormData` polyfill source](https://github.com/facebook/react-native/blob/v0.45.1/Libraries/Network/FormData.js#L34).
 * @prop {String} uri Filesystem path.
 * @prop {String} [name] File name.
 * @prop {String} [type] File content type.
 */

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
 * Checks a value is an enumerable object.
 * @kind function
 * @name isObject
 * @param {*} value A value to check.
 * @returns {boolean} Is the value an enumerable object.
 * @ignore
 */
export const isObject = value => typeof value === 'object' && value !== null

/**
 * Reversibly extracts [`File`](https://developer.mozilla.org/docs/web/api/file),
 * [`Blob`](https://developer.mozilla.org/docs/web/api/blob) and
 * [`ReactNativeFile`]{@link ReactNativeFile} instances from an object tree
 * along with their object paths and replaces them with `null`.
 * [`FileList`](https://developer.mozilla.org/docs/web/api/filelist) instances
 * are converted to `File` instance arrays.
 * @kind function
 * @name extractFiles
 * @param {Object} tree An object tree to extract files from. The tree itself must not be a file.
 * @param {string} [treePath=''] Optional object tree path to prefix file paths.
 * @returns {ExtractedFile[]} Extracted files or an empty array if the tree is not an enumerable object.
 * @example <caption>Extracting files.</caption>
 * The following:
 *
 * ```js
 * import extractFiles from 'extract-files'
 *
 * console.log(
 *   extractFiles(
 *     {
 *       a: new File(['a'], 'a.txt', { type: 'text/plain' }),
 *       b: {
 *         c: [new File(['b'], 'b.txt', { type: 'text/plain' })]
 *       }
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
 *   path: 'prefix.b.c.0',
 *   file: [object File]
 * }]
 * ```
 */
export default function extractFiles(tree, treePath = '') {
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

/**
 * Used to mark a [React Native `window.File` substitute]{@link ReactNativeFileSubstitute}
 * in an object tree for [`extractFiles`]{@link extractFiles}. It’s too risky to
 * assume all objects with `uri`, `type` and `name` properties are files to
 * extract.
 * @kind class
 * @name ReactNativeFile
 * @param {ReactNativeFileSubstitute} file A React Native file substitute.
 * @example <caption>An extractable file in React Native.</caption>
 * ```js
 * const file = new ReactNativeFile({
 *   uri: uriFromCameraRoll,
 *   name: 'a.jpg',
 *   type: 'image/jpeg'
 * })
 * ```
 */
export class ReactNativeFile {
  // eslint-disable-next-line require-jsdoc
  constructor({ uri, name, type }) {
    this.uri = uri
    this.name = name
    this.type = type
  }
}
