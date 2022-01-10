# extract-files

[![npm version](https://badgen.net/npm/v/extract-files)](https://npm.im/extract-files) [![CI status](https://github.com/jaydenseric/extract-files/workflows/CI/badge.svg)](https://github.com/jaydenseric/extract-files/actions)

A function to recursively extract files and their object paths within a value, replacing them with `null` in a deep clone without mutating the original value. By default, “files” are [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File), [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob), and [`ReactNativeFile`](#class-reactnativefile) instances. [`FileList`](https://developer.mozilla.org/en-US/docs/Web/API/Filelist) instances are treated as [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) instance arrays.

Used by [GraphQL multipart request spec client implementations](https://github.com/jaydenseric/graphql-multipart-request-spec#implementations) such as [`graphql-react`](https://npm.im/graphql-react) and [`apollo-upload-client`](https://npm.im/apollo-upload-client).

## Installation

To install with [npm](https://npmjs.com/get-npm), run:

```sh
npm install extract-files
```

See the documentation for the function [`extractFiles`](#exports-extractFiles.mjs-export-default) to get started.

## Requirements

- [Node.js](https://nodejs.org): `^12.22.0 || ^14.17.0 || >= 16.0.0`
- [Browsers](https://npm.im/browserslist): `> 0.5%, not OperaMini all, not IE > 0, not dead`
- [React Native](https://reactnative.dev)

## Exports

These ECMAScript modules are published to [npm](https://npmjs.com) and exported via the [`package.json`](./package.json) `exports` field:

- [`extractFiles.mjs`](#exports-extractFiles.mjs)
- [`isExtractableFile.mjs`](#exports-isExtractableFile.mjs)
- [`ReactNativeFile.mjs`](#exports-ReactNativeFile.mjs)

### <span id="exports-extractFiles.mjs">[`extractFiles.mjs`](./extractFiles.mjs)</span>

#### <span id="exports-extractFiles.mjs-export-default">Export `default`</span>

Function `extractFiles` — Recursively extracts files and their [object paths](#exports-extractFiles.mjs-type-ObjectPath) within a value, replacing them with `null` in a deep clone without mutating the original value. By default, “files” are [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File), [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob), and [`ReactNativeFile`](#exports-ReactNativeFile.mjs-export-default) instances. [`FileList`](https://developer.mozilla.org/en-US/docs/Web/API/Filelist) instances are treated as [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) instance arrays.

##### <span id="exports-extractFiles.mjs-export-default-parameters">Parameters</span>

1. `value`: `unknown` — Value (typically an object tree) to extract files from.
2. `path` `?`: [`ObjectPath`](#exports-extractFiles.mjs-type-ObjectPath) — Prefix for object paths for extracted files. Defaults to `""`.
3. `isExtractableFile` `?`: [`ExtractableFileMatcher`](#exports-extractFiles.mjs-type-ExtractableFileMatcher) — Function that matches extractable files. Defaults to [`isExtractableFile`](#exports-isExtractableFile.mjs-export-default).

##### <span id="exports-extractFiles.mjs-export-default-returns">Returns</span>

[`ExtractFilesResult`](#exports-extractFiles.mjs-type-ExtractFilesResult) — Result.

##### <span id="exports-extractFiles.mjs-export-default-example-1">Example 1</span>

Extracting files from an object.

For the following:

```js
const file1 = new File(["1"], "1.txt", { type: "text/plain" });
const file2 = new File(["2"], "2.txt", { type: "text/plain" });
const value = {
  a: file1,
  b: [file1, file2],
};

const { clone, files } = extractFiles(value, "prefix");
```

`value` remains the same.

`clone` is:

```json
{
  "a": null,
  "b": [null, null]
}
```

`files` is a [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) instance containing:

| Key     | Value                        |
| :------ | :--------------------------- |
| `file1` | `["prefix.a", "prefix.b.0"]` |
| `file2` | `["prefix.b.1"]`             |

#### <span id="exports-extractFiles.mjs-type-ExtractableFileMatcher">Type `ExtractableFileMatcher`</span>

Function — A function that checks if a value is an extractable file.

##### <span id="exports-extractFiles.mjs-type-ExtractableFileMatcher-returns">Returns</span>

`boolean` — Is the value an extractable file.

##### <span id="exports-extractFiles.mjs-type-ExtractableFileMatcher-see">See</span>

- [`isExtractableFile`](#exports-isExtractableFile.mjs-export-default), the default extractable file matcher for [`extractFiles`](#exports-extractFiles.mjs-export-default).

##### <span id="exports-extractFiles.mjs-type-ExtractableFileMatcher-example-1">Example 1</span>

How to check for the default exactable files, as well as a custom type of file:

```js
import isExtractableFile from "extract-files/isExtractableFile.mjs";

const isExtractableFileEnhanced = (value) =>
  isExtractableFile(value) ||
  (typeof CustomFile !== "undefined" && value instanceof CustomFile);
```

#### <span id="exports-extractFiles.mjs-type-ExtractFilesResult">Type `ExtractFilesResult`</span>

`object` — What [`extractFiles`](#exports-extractFiles.mjs-export-default) returns.

##### <span id="exports-extractFiles.mjs-type-ExtractFilesResult-properties">Properties</span>

- `clone`: `unknown` — Clone of the original input value with files recursively replaced with `null`.
- `files`: `Map`<`unknown`, `Array`<[`ObjectPath`](#exports-extractFiles.mjs-type-ObjectPath)>> — Extracted files and their object paths within the input value.

#### <span id="exports-extractFiles.mjs-type-ObjectPath">Type `ObjectPath`</span>

`string` — String notation for the path to a node in an object tree.

##### <span id="exports-extractFiles.mjs-type-ObjectPath-see">See</span>

- [`object-path` on npm](https://npm.im/object-path).

##### <span id="exports-waterfallRender.mjs-type-ObjectPath-example-1">Example 1</span>

An object path for object property `a`, array index `0`, object property `b`:

```
a.0.b
```

### <span id="exports-isExtractableFile.mjs">[`isExtractableFile.mjs`](./isExtractableFile.mjs)</span>

#### <span id="exports-isExtractableFile.mjs-export-default">Export `default`</span>

[`ExtractableFileMatcher`](#exports-extractFiles.mjs-type-ExtractableFileMatcher) `isExtractableFile` — Checks if a value is an [extractable file](#exports-isExtractableFile.mjs-type-ExtractableFile).

##### <span id="exports-isExtractableFile.mjs-export-default-parameters">Parameters</span>

1. `value`: `unknown` — Value to check.

##### <span id="exports-isExtractableFile.mjs-export-default-returns">Returns</span>

`value is` [`ExtractableFile`](#exports-isExtractableFile.mjs-type-ExtractableFile) — Is the value an [extractable file](#exports-isExtractableFile.mjs-type-ExtractableFile).

#### <span id="exports-isExtractableFile.mjs-type-ExtractableFile">Type `ExtractableFile`</span>

[`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) | [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) | [`ReactNativeFile`](#exports-ReactNativeFile.mjs-export-default) — An extractable file.

### <span id="exports-ReactNativeFile.mjs">[`ReactNativeFile.mjs`](./ReactNativeFile.mjs)</span>

#### <span id="exports-ReactNativeFile.mjs-export-default">Export `default`</span>

Class `ReactNativeFile` — A [React Native `File` substitute](#exports-ReactNativeFile.mjs-type-ReactNativeFileSubstitute) that can be accurately matched as such using `instanceof`. It can’t be assumed that all objects with `uri`, `type` and `name` properties are files.

##### <span id="exports-ReactNativeFile.mjs-export-default-parameters">Parameters</span>

1. `file`: [`ReactNativeFileSubstitute`](#exports-ReactNativeFile.mjs-type-ReactNativeFileSubstitute) — A [React Native `File` substitute](#exports-ReactNativeFile.mjs-type-ReactNativeFileSubstitute).

##### <span id="exports-ReactNativeFile.mjs-export-default-instance-property-uri">Instance property `uri`</span>

[`ReactNativeFileSubstitute`](#exports-ReactNativeFile.mjs-type-ReactNativeFileSubstitute-properties)`["uri"]` — Filesystem path.

##### <span id="exports-ReactNativeFile.mjs-export-default-instance-property-name">Instance property `name`</span>

[`ReactNativeFileSubstitute`](#exports-ReactNativeFile.mjs-type-ReactNativeFileSubstitute-properties)`["name"]` — File name.

##### <span id="exports-ReactNativeFile.mjs-export-default-instance-property-type">Instance property `type`</span>

[`ReactNativeFileSubstitute`](#exports-ReactNativeFile.mjs-type-ReactNativeFileSubstitute-properties)`["type"]` — File content type.

#### <span id="exports-ReactNativeFile.mjs-type-ReactNativeFileSubstitute">Type `ReactNativeFileSubstitute`</span>

`object` — A [React Native](https://reactnative.dev) [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) substitute for use with [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData).

##### <span id="exports-ReactNativeFile.mjs-type-ReactNativeFileSubstitute-properties">Properties</span>

- `uri`: `string` — Filesystem path.
- `name` `?`: `string` — File name.
- `type` `?`: `string` — File content type.

##### <span id="exports-ReactNativeFile.mjs-type-ReactNativeFileSubstitute-see">See</span>

- [React Native `FormData` polyfill source](https://github.com/facebook/react-native/blob/v0.66.4/Libraries/Network/FormData.js#L37-L41).

##### <span id="exports-ReactNativeFile.mjs-type-ReactNativeFileSubstitute-example-1">Example 1</span>

A camera roll file:

```js
const fileSubstitute = {
  uri: uriFromCameraRoll,
  name: "a.jpg",
  type: "image/jpeg",
};
```
