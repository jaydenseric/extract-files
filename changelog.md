# extract-files changelog

## Next

### Minor

- Refactored package scripts to use `prepare` to support installation via Git (e.g. `npm install jaydenseric/extract-files`).

### Patch

- Use [`tap`](https://npm.im/tap) instead of [`ava`](https://npm.im/ava). Tests no longer transpile on the fly, are faster and AVA no longer dictates the Babel version.
- Removed the package clean script `rimraf` dev dependency in favour of native `rm -rf`.
- Removed the package `fix` script.
- Renamed the `MODULE` environment variable to `BABEL_ESM` to be more specific for the package `prepare:mjs` script.
- Lint `.json`, `.yml` and `.md` files.
- Use `.prettierignore` to leave `package.json` formatting to npm.
- Use [`eslint-config-env`](https://npm.im/eslint-config-env).
- Compact package `repository` field.
- HTTPS package author URL.

## 3.1.0

- Updated dependencies.
- Added support for [`Blob`](https://developer.mozilla.org/en/docs/Web/API/Blob) types, via [#5](https://github.com/jaydenseric/extract-files/pull/5).

## 3.0.0

- Updated dependencies.
- The `extractFiles` function is now the default export.
- Replace extracted files with `null` instead of deletion, fixing [#4](https://github.com/jaydenseric/extract-files/issues/4).
- Simplified npm scripts.

## 2.1.1

- Setup Travis to test using the latest stable Node.js version and the oldest supported in `package.json` `engines` (v6.10).
- Added a Travis readme badge.

## 2.1.0

- Updated dependencies.
- Updated Prettier and ESLint config.
- Prettier formats distribution code as well as source code, along with the readme and changelog.
- No more source maps; Prettier does not support them.
- Added a clean step to builds.
- Renamed `dist` directory to `lib`.
- Modular project structure that works better for native ESM.
- Module files now have `.mjs` extension.
- Using Babel directly instead of Rollup.
- Smarter Babel config with `.babelrc.js`.
- Reduced bundle size, fixing [#3](https://github.com/jaydenseric/extract-files/issues/3):
  - Using `babel-preset-env` to handle polyfills so only required ones are included for supported environments.
  - Using `Array.prototype.slice.call` to convert `FileList` instances to arrays instead of `Array.from` which requires a lot of polyfills.
- Target Node.js v6.10+ for transpilation and polyfills via `package.json` `engines`.
- Support [browsers with >1% global usage](http://browserl.ist/?q=%3E1%25) (was >2%).
- Updated the readme support section.
- Added links to readme badges.

## 2.0.1

- Updated dependencies.
- Fixed incorrect usage example code for `ReactNativeFile.list`, via [#1](https://github.com/jaydenseric/extract-files/pull/1).

## 2.0.0

- Updated dependencies.
- Extracted file paths no longer begin with `.` when no tree path is passed to `extractFiles`.

## 1.1.0

- Updated dependencies.
- Added tests.
- Removed `lint-staged`, linting and tests now run on commit.
- Fixed `extractFiles` bugs by using logic that worked in [`apollo-upload-client@5`](https://github.com/jaydenseric/apollo-upload-client/tree/v5.0.0).

## 1.0.0

- Initial release.
