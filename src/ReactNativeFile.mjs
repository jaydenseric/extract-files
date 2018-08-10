/**
 * A React Native `File` substitute when using `FormData`.
 * @kind typedef
 * @name ReactNativeFileSubstitute
 * @type {Object}
 * @see [React Native `FormData` polyfill source](https://github.com/facebook/react-native/blob/v0.45.1/Libraries/Network/FormData.js#L34).
 * @prop {String} uri Filesystem path.
 * @prop {String} [name] File name.
 * @prop {String} [type] File content type.
 */

/**
 * Used to mark a [React Native `File` substitute]{@link ReactNativeFileSubstitute}
 * in an object tree for [`extractFiles`]{@link extractFiles}. It’s too risky to
 * assume all objects with `uri`, `type` and `name` properties are files to
 * extract.
 * @kind class
 * @name ReactNativeFile
 * @param {ReactNativeFileSubstitute} file A React Native file substitute.
 * @example <caption>An extractable file in React Native.</caption>
 * ```js
 * import { ReactNativeFile } from 'extract-files'
 *
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
