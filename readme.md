# extract-files

[![npm version](https://badgen.net/npm/v/extract-files)](https://npm.im/extract-files) [![CI status](https://github.com/jaydenseric/extract-files/workflows/CI/badge.svg)](https://github.com/jaydenseric/extract-files/actions)

A function to recursively extract files and their object paths within a value, replacing them with `null` in a deep clone without mutating the original value. [`FileList`](https://developer.mozilla.org/en-US/docs/Web/API/Filelist) instances are treated as [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) instance arrays. Files are typically [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) and [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) instances.

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

## Exports

These ECMAScript modules are published to [npm](https://npmjs.com) and exported via the [`package.json`](./package.json) `exports` field:

- [`extractFiles.mjs`](#exports-extractFiles.mjs)
- [`isExtractableFile.mjs`](#exports-isExtractableFile.mjs)

### <span id="exports-extractFiles.mjs">[`extractFiles.mjs`](./extractFiles.mjs)</span>

#### <span id="exports-extractFiles.mjs-export-default">Export `default`</span>

Function `extractFiles` — Recursively extracts files and their [object paths](#exports-extractFiles.mjs-type-ObjectPath) within a value, replacing them with `null` in a deep clone without mutating the original value. [`FileList`](https://developer.mozilla.org/en-US/docs/Web/API/Filelist) instances are treated as [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) instance arrays.

##### <span id="exports-extractFiles.mjs-export-default-type-parameters">Type parameters</span>

1. `Extractable`: `any` — Extractable file type.

##### <span id="exports-extractFiles.mjs-export-default-parameters">Parameters</span>

1. `value`: `unknown` — Value to extract files from. Typically an object tree.
2. `isExtractable`: `(value: unknown) => value is Extractable` — Matches extractable files. Typically [`isExtractableFile`](#exports-isExtractableFile.mjs-export-default).
3. `path` `?`: [`ObjectPath`](#exports-extractFiles.mjs-type-ObjectPath) — Prefix for object paths for extracted files. Defaults to `""`.

##### <span id="exports-extractFiles.mjs-export-default-returns">Returns</span>

[`Extraction`](#exports-extractFiles.mjs-type-Extraction)<`Extractable`> — Extraction result.

##### <span id="exports-extractFiles.mjs-export-default-example-1">Example 1</span>

Extracting files from an object.

For the following:

```js
import extractFiles from "extract-files/extractFiles.mjs";
import isExtractableFile from "extract-files/isExtractableFile.mjs";

const file1 = new File(["1"], "1.txt", { type: "text/plain" });
const file2 = new File(["2"], "2.txt", { type: "text/plain" });
const value = {
  a: file1,
  b: [file1, file2],
};

const { clone, files } = extractFiles(value, isExtractableFile, "prefix");
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

#### <span id="exports-extractFiles.mjs-type-Extraction">Type `Extraction`</span>

`object` — An extraction result.

##### <span id="exports-extractFiles.mjs-type-Extraction-type-parameters">Type parameters</span>

1. `Extractable` `?`: `any` — Extractable file type. Defaults to `unknown`.

##### <span id="exports-extractFiles.mjs-type-Extraction-properties">Properties</span>

- `clone`: `unknown` — Clone of the original value with files recursively replaced with `null`.
- `files`: `Map`<`Extractable`, `Array`<[`ObjectPath`](#exports-extractFiles.mjs-type-ObjectPath)>> — Extracted files and their object paths within the original value.

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

Function `isExtractableFile` — Checks if a value is an [extractable file](#exports-isExtractableFile.mjs-type-ExtractableFile).

##### <span id="exports-isExtractableFile.mjs-export-default-parameters">Parameters</span>

1. `value`: `unknown` — Value to check.

##### <span id="exports-isExtractableFile.mjs-export-default-returns">Returns</span>

`value is` [`ExtractableFile`](#exports-isExtractableFile.mjs-type-ExtractableFile) — Is the value an [extractable file](#exports-isExtractableFile.mjs-type-ExtractableFile).

#### <span id="exports-isExtractableFile.mjs-type-ExtractableFile">Type `ExtractableFile`</span>

[`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) | [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) — An extractable file.
