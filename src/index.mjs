export { extractFiles } from './extractFiles'
export { ReactNativeFile } from './ReactNativeFile'
export { isExtractableFile } from './isExtractableFile'

/**
 * An extractable file.
 * @kind typedef
 * @name ExtractableFile
 * @type {File|Blob|ReactNativeFile}
 */

/**
 * A function that checks if a value is an extractable file.
 * @kind typedef
 * @name ExtractableFileMatcher
 * @type {Function}
 * @see [`isExtractableFile`]{@link isExtractableFile} is the default extractable file matcher.
 * @example <caption>How to check for the default exactable files, as well as a custom type of file.</caption>
 * ```js
 * import { isExtractableFile } from 'extract-files'
 *
 * const isExtractableFileEnhanced = value =>
 *   isExtractableFile(value) ||
 *   (typeof CustomFile !== 'undefined' && value instanceof CustomFile)
 * ```
 */

/**
 * What [`extractFiles`]{@link extractFiles} returns.
 * @kind typedef
 * @name ExtractFilesResult
 * @type {object}
 * @prop {*} clone Clone of the original input value with files recursively replaced with `null`.
 * @prop {Map<ExtractableFile,Array<ObjectPath>>} files Extracted files and their locations within the original value.
 */

/**
 * String notation for the path to a node in an object tree.
 * @kind typedef
 * @name ObjectPath
 * @type {string}
 * @see [`object-path` on npm](https://npm.im/object-path).
 * @example <caption>Object path is property `a`, array index `0`, object property `b`.</caption>
 * ```
 * a.0.b
 * ```
 */

/**
 * A React Native [`File`](https://developer.mozilla.org/docs/web/api/file)
 * substitute for when using [`FormData`](https://developer.mozilla.org/docs/web/api/formdata).
 * @kind typedef
 * @name ReactNativeFileSubstitute
 * @type {object}
 * @see [React Native `FormData` polyfill source](https://github.com/facebook/react-native/blob/v0.45.1/Libraries/Network/FormData.js#L34).
 * @prop {string} uri Filesystem path.
 * @prop {string} [name] File name.
 * @prop {string} [type] File content type.
 * @example <caption>A camera roll file.</caption>
 * ```js
 * {
 *   uri: uriFromCameraRoll,
 *   name: 'a.jpg',
 *   type: 'image/jpeg'
 * }
 * ```
 */
