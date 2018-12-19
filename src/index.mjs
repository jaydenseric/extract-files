export { extractFiles } from './extractFiles'
export { ReactNativeFile } from './ReactNativeFile'

/**
 * An extractable file.
 * @kind typedef
 * @name ExtractableFile
 * @type {File|Blob|ReactNativeFile}
 */

/**
 * What [`extractFiles`]{@link extractFiles} returns.
 * @kind typedef
 * @name ExtractFilesResult
 * @type {Object}
 * @prop {*} clone Clone of the original input value with files recursively replaced with `null`.
 * @prop {Map<ExtractableFile,Array<ObjectPath>>} files Extracted files and their locations within the original value.
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
 * A React Native [`File`](https://developer.mozilla.org/docs/web/api/file)
 * substitute for when using [`FormData`](https://developer.mozilla.org/docs/web/api/formdata).
 * @kind typedef
 * @name ReactNativeFileSubstitute
 * @type {Object}
 * @see [React Native `FormData` polyfill source](https://github.com/facebook/react-native/blob/v0.45.1/Libraries/Network/FormData.js#L34).
 * @prop {String} uri Filesystem path.
 * @prop {String} [name] File name.
 * @prop {String} [type] File content type.
 * @example <caption>A camera roll file.</caption>
 * ```js
 * {
 *   uri: uriFromCameraRoll,
 *   name: 'a.jpg',
 *   type: 'image/jpeg'
 * }
 * ```
 */
