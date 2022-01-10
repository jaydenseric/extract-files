// @ts-check

/** @typedef {import("./extractFiles.mjs").default} extractFiles */

/**
 * A {@link ReactNativeFileSubstitute React Native `File` substitute} that can
 * be accurately matched as such using `instanceof`. It can’t be assumed that
 * all objects with `uri`, `type` and `name` properties are files.
 * @example
 * An extractable file in [React Native](https://reactnative.dev):
 *
 * ```js
 * const file = new ReactNativeFile({
 *   uri: uriFromCameraRoll,
 *   name: "a.jpg",
 *   type: "image/jpeg",
 * });
 * ```
 */
export default class ReactNativeFile {
  /**
   * @param {ReactNativeFileSubstitute} file A
   *   {@link ReactNativeFileSubstitute React Native `File` substitute}.
   */
  constructor({ uri, name, type }) {
    /**
     * Filesystem path.
     * @type {ReactNativeFileSubstitute["uri"]}
     */
    this.uri = uri;

    /**
     * File name.
     * @type {ReactNativeFileSubstitute["name"]}
     */
    this.name = name;

    /**
     * File content type.
     * @type {ReactNativeFileSubstitute["type"]}
     */
    this.type = type;
  }
}

/**
 * A [React Native](https://reactnative.dev)
 * [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File)
 * substitute for use with
 * [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData).
 * @typedef {object} ReactNativeFileSubstitute
 * @prop {string} uri Filesystem path.
 * @prop {string} [name] File name.
 * @prop {string} [type] File content type.
 * @see [React Native `FormData` polyfill source](https://github.com/facebook/react-native/blob/v0.66.4/Libraries/Network/FormData.js#L37-L41).
 * @example
 * A camera roll file:
 *
 * ```js
 * const fileSubstitute = {
 *   uri: uriFromCameraRoll,
 *   name: "a.jpg",
 *   type: "image/jpeg",
 * };
 * ```
 */
