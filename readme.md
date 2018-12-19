# extract-files

[![npm version](https://badgen.net/npm/v/extract-files)](https://npm.im/extract-files) [![Build status](https://travis-ci.org/jaydenseric/extract-files.svg?branch=master)](https://travis-ci.org/jaydenseric/extract-files)

Clones a value, recursively extracting [`File`](https://developer.mozilla.org/docs/web/api/file), [`Blob`](https://developer.mozilla.org/docs/web/api/blob) and [`ReactNativeFile`](#class-reactnativefile) instances with their [object paths](#type-objectpath), replacing them with `null`. [`FileList`](https://developer.mozilla.org/docs/web/api/filelist) instances are treated as [`File`](https://developer.mozilla.org/docs/web/api/file) instance arrays.

## Usage

Install with [npm](https://npmjs.com):

```shell
npm install extract-files
```

See the [`extractFiles`](#function-extractfiles) documentation to get started.

## Support

- Node.js v6+
- Browsers [`> 0.5%, not dead`](https://browserl.ist/?q=%3E+0.5%25%2C+not+dead)
- React Native

## API

### Table of contents

- [class ReactNativeFile](#class-reactnativefile)
  - [Examples](#examples)
- [function extractFiles](#function-extractfiles)
  - [Examples](#examples-1)
- [type ExtractedFile](#type-extractedfile)
- [type ExtractFilesResult](#type-extractfilesresult)
- [type ObjectPath](#type-objectpath)
  - [See](#see)
  - [Examples](#examples-2)
- [type ReactNativeFileSubstitute](#type-reactnativefilesubstitute)
  - [See](#see-1)
  - [Examples](#examples-3)

### class ReactNativeFile

Used to mark a [React Native `File` substitute](#type-reactnativefilesubstitute) in an object tree for [`extractFiles`](#function-extractfiles). It’s too risky to assume all objects with `uri`, `type` and `name` properties are files to extract.

| Parameter | Type                                                         | Description                                                                          |
| :-------- | :----------------------------------------------------------- | :----------------------------------------------------------------------------------- |
| `file`    | [ReactNativeFileSubstitute](#type-reactnativefilesubstitute) | A React Native [`File`](https://developer.mozilla.org/docs/web/api/file) substitute. |

#### Examples

_An extractable file in React Native._

> ```js
> import { ReactNativeFile } from 'extract-files'
>
> const file = new ReactNativeFile({
>   uri: uriFromCameraRoll,
>   name: 'a.jpg',
>   type: 'image/jpeg'
> })
> ```

### function extractFiles

Clones a value, recursively extracting [`File`](https://developer.mozilla.org/docs/web/api/file), [`Blob`](https://developer.mozilla.org/docs/web/api/blob) and [`ReactNativeFile`](#class-reactnativefile) instances with their [object paths](#type-objectpath), replacing them with `null`. [`FileList`](https://developer.mozilla.org/docs/web/api/filelist) instances are treated as [`File`](https://developer.mozilla.org/docs/web/api/file) instance arrays.

| Parameter | Type                                    | Description                                             |
| :-------- | :-------------------------------------- | :------------------------------------------------------ |
| `value`   | \*                                      | Value (typically an object tree) to extract files from. |
| `path`    | [string](https://mdn.io/string)? = `''` | Root path to prefix object paths for extracted files.   |

**Returns:** [ExtractFilesResult](#type-extractfilesresult) — Result.

#### Examples

_Extracting files._

> The following:
>
> ```js
> import { extractFiles } from 'extract-files'
>
> const file1 = new File(['1'], '1.txt', { type: 'text/plain' })
> const file2 = new File(['2'], '2.txt', { type: 'text/plain' })
>
> console.log(extractFiles({ a: file1, b: [{ a: file2 }] }, 'prefix'))
> ```
>
> Logs:
>
>     [{
>       path: 'prefix.a',
>       file: [object File]
>     }, {
>       path: 'prefix.b.0.a',
>       file: [object File]
>     }]

### type ExtractedFile

An extracted file.

**Type:** [Object](https://mdn.io/object)

| Property | Type                                                      | Description                                          |
| :------- | :-------------------------------------------------------- | :--------------------------------------------------- |
| `path`   | [ObjectPath](#type-objectpath)                            | Object path to the file in the original object tree. |
| `file`   | File \| Blob \| [ReactNativeFile](#class-reactnativefile) | The extracted file.                                  |

### type ExtractFilesResult

A result returned from [`extractFiles`](#function-extractfiles).

**Type:** [Object](https://mdn.io/object)

| Property | Type                                                                   | Description                                                                    |
| :------- | :--------------------------------------------------------------------- | :----------------------------------------------------------------------------- |
| `clone`  | \*                                                                     | Clone of the original input value with files recursively replaced with `null`. |
| `files`  | [Array](https://mdn.io/array)&lt;[ExtractedFile](#type-extractedfile)> | Extracted files.                                                               |

### type ObjectPath

String notation for the path to a node in an object tree.

**Type:** [String](https://mdn.io/string)

#### See

- [`object-path` on npm](https://npm.im/object-path).

#### Examples

_Object path is property `a`, array index `0`, object property `b`._

>     a.0.b

### type ReactNativeFileSubstitute

A React Native [`File`](https://developer.mozilla.org/docs/web/api/file) substitute for when using [`FormData`](https://developer.mozilla.org/docs/web/api/formdata).

**Type:** [Object](https://mdn.io/object)

| Property | Type                             | Description        |
| :------- | :------------------------------- | :----------------- |
| `uri`    | [String](https://mdn.io/string)  | Filesystem path.   |
| `name`   | [String](https://mdn.io/string)? | File name.         |
| `type`   | [String](https://mdn.io/string)? | File content type. |

#### See

- [React Native `FormData` polyfill source](https://github.com/facebook/react-native/blob/v0.45.1/Libraries/Network/FormData.js#L34).

#### Examples

_A camera roll file._

> ```js
> {
>   uri: uriFromCameraRoll,
>   name: 'a.jpg',
>   type: 'image/jpeg'
> }
> ```
