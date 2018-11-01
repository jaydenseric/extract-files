# extract-files changelog

## 4.1.0

### Minor

- Support more browsers by changing the [Browserslist](https://github.com/browserslist/browserslist) query from [`> 1%`](https://browserl.ist/?q=%3E+1%25) to [`> 0.5%, not dead`](https://browserl.ist/?q=%3E+0.5%25%2C+not+dead).

### Patch

- Updated dev dependencies.
- Ensure Babel reads from the package `browserslist` field due to [a sneaky `@babel/preset-env` breaking change](https://github.com/babel/babel/pull/8509).
- Updated package scripts and config for the new [`husky`](https://npm.im/husky) version.
- Removed the package `module` field. Webpack by default resolves extensionless paths the same way Node.js in `--experimental-modules` mode does; `.mjs` files are preferred. Tools misconfigured or unable to resolve `.mjs` can get confused when `module` points to an `.mjs` ESM file and they attempt to resolve named imports from `.js` CJS files.
- Added a `ReactNativeFileSubstitute` type example.
- Move JSDoc typedefs to the end of files to make it quicker to find the code.
- Regenerated the readme API docs using the latest [`jsdoc-md`](https://npm.im/jsdoc-md) version.
- Tests now log if the environment is CJS or ESM (`--experimental-modules`) and the `NODE_ENV`.

## 4.0.0

### Major

- `extractFiles` is a named export again, and there is no longer a default export; mixed named and default exports causes native ESM and CJS interoperability issues.
- `isObject` is no longer exported. It was not a documented API anyway.
- Removed the `ReactNativeFile` static function `list`. It added surface area to the API and bundles and is simple to do manually.

### Minor

- Updated Babel, removing the `@babel/runtime` dependency.
- Refactored package scripts to use `prepare` to support installation via Git (e.g. `npm install jaydenseric/extract-files`).
- Package [marked side-effect free](https://webpack.js.org/guides/tree-shaking#mark-the-file-as-side-effect-free) for bundlers and tree-shaking.

### Patch

- Use [`jsdoc-md`](https://npm.im/jsdoc-md) to generate readme API docs from source JSDoc, which has been much improved.
- Use [`tap`](https://npm.im/tap) instead of [`ava`](https://npm.im/ava). Tests no longer transpile on the fly, are faster and AVA no longer dictates the Babel version.
- Tests run against the actual dist `.mjs` and `.js` files in both native ESM (`--experimental-modules`) and CJS environments.
- Added a package `test:size` script, using [`size-limit`](https://npm.im/size-limit) to guarantee < 500 byte ESM and CJS bundle sizes.
- Removed the package clean script `rimraf` dev dependency in favour of native `rm -rf`.
- Removed the package `fix` script.
- Renamed the `MODULE` environment variable to `BABEL_ESM` to be more specific for the package `prepare:mjs` script.
- Lint `.json`, `.yml` and `.md` files.
- Use `.prettierignore` to leave `package.json` formatting to npm.
- Use [`eslint-config-env`](https://npm.im/eslint-config-env).
- Compact package `repository` field.
- Updated package description.
- HTTPS package author URL.
- Added package keywords.
- Replaced [shields.io](https://shields.io) readme badges with:
  - A [Badgen](https://badgen.net) npm version badge.
  - An official Travis badge that only tracks `master` branch.
- Changelog version entries now have “Major”, “Minor” and “Patch” subheadings.

## 3.1.0

### Minor

- Added support for [`Blob`](https://developer.mozilla.org/en/docs/Web/API/Blob) types, via [#5](https://github.com/jaydenseric/extract-files/pull/5).

### Patch

- Updated dependencies.

## 3.0.0

### Major

- The `extractFiles` function is now the default export.
- Replace extracted files with `null` instead of deletion, fixing [#4](https://github.com/jaydenseric/extract-files/issues/4).

### Patch

- Updated dev dependencies.
- Simplified npm scripts.

## 2.1.1

### Patch

- Setup Travis to test using the latest stable Node.js version and the oldest supported in `package.json` `engines` (v6.10).
- Added a Travis readme badge.

## 2.1.0

### Minor

- Support [browsers with >1% global usage](http://browserl.ist/?q=%3E1%25) (was >2%).
- Target Node.js v6.10+ for transpilation and polyfills via `package.json` `engines`.
- Support Node.js native ESM via `--experimental-modules`:
  - Module files now have `.mjs` extension.
  - Modular project structure that works better for native ESM.
- Reduced bundle size, fixing [#3](https://github.com/jaydenseric/extract-files/issues/3):
  - Using `babel-preset-env` to handle polyfills so only required ones are included for supported environments.
  - Using `Array.prototype.slice.call` to convert `FileList` instances to arrays instead of `Array.from` which requires a lot of polyfills.

### Patch

- Updated dependencies.
- Updated Prettier and ESLint config.
- Prettier formats distribution code as well as source code, along with the readme and changelog.
- No more source maps; Prettier does not support them.
- Added a clean step to builds.
- Renamed `dist` directory to `lib`.
- Using Babel directly instead of Rollup.
- Smarter Babel config with `.babelrc.js`.
- Added links to readme badges.
- Updated the readme support section.

## 2.0.1

### Patch

- Updated dependencies.
- Fixed incorrect usage example code for `ReactNativeFile.list`, via [#1](https://github.com/jaydenseric/extract-files/pull/1).

## 2.0.0

### Major

- Extracted file paths no longer begin with `.` when no tree path is passed to `extractFiles`.

### Patch

- Updated dev dependencies.

## 1.1.0

### Minor

- Added tests.

### Patch

- Updated dev dependencies.
- Removed `lint-staged`, linting and tests now run on commit.
- Fixed `extractFiles` bugs by using logic that worked in [`apollo-upload-client@5`](https://github.com/jaydenseric/apollo-upload-client/tree/v5.0.0).

## 1.0.0

Initial release.
