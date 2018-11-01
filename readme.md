# extract-files

[![npm version](https://badgen.net/npm/v/extract-files)](https://npm.im/extract-files) [![Build status](https://travis-ci.org/jaydenseric/extract-files.svg?branch=master)](https://travis-ci.org/jaydenseric/extract-files)

Reversibly extracts [`File`](https://developer.mozilla.org/docs/web/api/file), [`Blob`](https://developer.mozilla.org/docs/web/api/blob) and [`ReactNativeFile`](#class-reactnativefile) instances, with [object paths](#type-objectpath), from an object tree and replaces them with `null`. [`FileList`](https://developer.mozilla.org/docs/web/api/filelist) instances are treated as [`File`](https://developer.mozilla.org/docs/web/api/file) instance arrays.

## Usage

Install with [npm](https://npmjs.com):

```shell
npm install extract-files
```

See the [`extractFiles`](#function-extractfiles) documentation to get started.

### Reassembly

Loop and reinsert the extracted files using [`object-path`](https://npm.im/object-path):

```js
import { extractFiles } from 'extract-files'
import objectPath from 'object-path'
import tree from './tree'

const files = extractFiles(tree)
const treePath = objectPath(tree)

files.forEach(({ path, file }) => treePath.set(path, file))
```

[`FileList`](https://developer.mozilla.org/docs/web/api/filelist) instances in the original tree become [`File`](https://developer.mozilla.org/docs/web/api/file) instance arrays when reassembled.

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

Reversibly extracts [`File`](https://developer.mozilla.org/docs/web/api/file), [`Blob`](https://developer.mozilla.org/docs/web/api/blob) and [`ReactNativeFile`](#class-reactnativefile) instances, with [object paths](#type-objectpath), from an object tree and replaces them with `null`. [`FileList`](https://developer.mozilla.org/docs/web/api/filelist) instances are treated as [`File`](https://developer.mozilla.org/docs/web/api/file) instance arrays.

| Parameter  | Type                                    | Description                                                               |
| :--------- | :-------------------------------------- | :------------------------------------------------------------------------ |
| `tree`     | [Object](https://mdn.io/object)         | An object tree to extract files from. The tree itself must not be a file. |
| `treePath` | [string](https://mdn.io/string)? = `''` | Optional object tree path to prefix file object tree paths.               |

**Returns:** [Array](https://mdn.io/array)&lt;[ExtractedFile](#type-extractedfile)> — Extracted files or an empty array if the tree is not an enumerable object.

#### Examples

_Extracting files._

> The following:
>
> ```js
> import { extractFiles } from 'extract-files'
>
> console.log(
>   extractFiles(
>     {
>       a: new File(['a'], 'a.txt', { type: 'text/plain' }),
>       b: [
>         {
>           c: new File(['b'], 'b.txt', { type: 'text/plain' })
>         }
>       ]
>     },
>     'prefix'
>   )
> )
> ```
>
> Logs:
>
>     [{
>       path: 'prefix.a',
>       file: [object File]
>     }, {
>       path: 'prefix.b.0.c',
>       file: [object File]
>     }]

### type ExtractedFile

An extracted file.

**Type:** [Object](https://mdn.io/object)

| Property | Type                                                      | Description                                          |
| :------- | :-------------------------------------------------------- | :--------------------------------------------------- |
| `path`   | [ObjectPath](#type-objectpath)                            | Object path to the file in the original object tree. |
| `file`   | File \| Blob \| [ReactNativeFile](#class-reactnativefile) | The extracted file.                                  |

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
