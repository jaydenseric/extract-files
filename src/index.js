/**
 * A file extraction.
 * @typedef {Object} ExtractedFile
 * @property {String} path - Original location in the object tree.
 * @property {String} file - The actual file.
 */

/**
 * Reversibly extracts files from an object tree.
 * @param {object} tree - An object tree to extract files from.
 * @param {string} [treePath=''] - Optional tree path to prefix file paths.
 * @returns {ExtractedFile[]} Extracted files.
 */
export function extractFiles(tree, treePath = '') {
  const files = []

  // Recursively extracts files from an object tree
  function recurse(node, path, parent, key) {
    // Skip non-object
    if (typeof node !== 'object' || node === null) return

    // Is the node a file?
    if (
      // A File
      (typeof File !== 'undefined' && node instanceof File) ||
      // A ReactNativeFile
      node instanceof ReactNativeFile
    ) {
      // Extract the file and it's object tree path
      files.push({ path, file: node })

      // Delete the file. Array items must be deleted without reindexing to
      // allow repopulation in a reverse operation.
      delete parent[key]

      // No further checks or recursion
      return
    }

    // Is the node a FileList?
    if (typeof FileList !== 'undefined' && node instanceof FileList)
      // Convert read-only FileList to an array for manipulation
      parent[key] = Array.from(node)

    // Recurse into child nodes
    Object.keys(node).forEach(key =>
      recurse(node[key], `${path}.${key}`, node, key)
    )
  }

  // Recurse object tree
  recurse(tree, treePath)

  return files
}

/**
 * A React Native FormData file object.
 * @see {@link https://github.com/facebook/react-native/blob/v0.45.1/Libraries/Network/FormData.js#L34}
 * @typedef {Object} ReactNativeFileObject
 * @property {String} uri - File system path.
 * @property {String} [type] - File content type.
 * @property {String} [name] - File name.
 */

/**
 * A React Native file.
 */
export class ReactNativeFile {
  /**
   * Constructs a new file.
   * @param {ReactNativeFileObject} file
   * @example
   * const file = new ReactNativeFile({
   *  uri: uriFromCameraRoll,
   *  type: 'image/jpeg',
   *  name: 'photo.jpg'
   * })
   */
  constructor({ uri, type, name }) {
    this.uri = uri
    this.type = type
    this.name = name
  }

  /**
   * Creates an array of file instances.
   * @param {ReactNativeFileObject[]} files
   * @example
   * const files = ReactNativeFile.list({
   *   uri: uriFromCameraRoll1,
   *   type: 'image/jpeg',
   *   name: 'photo-1.jpg'
   * }, {
   *   uri: uriFromCameraRoll2,
   *   type: 'image/jpeg',
   *   name: 'photo-2.jpg'
   * })
   */
  static list = files => files.map(file => new ReactNativeFile(file))
}
