# extract-files

[![npm version](https://img.shields.io/npm/v/extract-files.svg)](https://npm.im/extract-files) ![Licence](https://img.shields.io/npm/l/extract-files.svg) [![Github issues](https://img.shields.io/github/issues/jaydenseric/extract-files.svg)](https://github.com/jaydenseric/extract-files/issues) [![Github stars](https://img.shields.io/github/stars/jaydenseric/extract-files.svg)](https://github.com/jaydenseric/extract-files/stargazers) [![Travis status](https://img.shields.io/travis/jaydenseric/extract-files.svg)](https://travis-ci.org/jaydenseric/extract-files)

Reversibly extracts files from a tree object.

Files are extracted along with their object path to allow reassembly and are replaced with `null` in the original tree.

Files may be [`File`](https://developer.mozilla.org/en/docs/Web/API/File), [`Blob`](https://developer.mozilla.org/en/docs/Web/API/Blob) and [`ReactNativeFile`](https://github.com/jaydenseric/extract-files#react-native) instances. [`FileList`](https://developer.mozilla.org/en/docs/Web/API/FileList) instances are converted to arrays and the items are extracted as `File` instances.

## Usage

Install with [npm](https://npmjs.com):

```shell
npm install extract-files
```

`extractFiles` accepts a tree object to extract files from, along with an optional tree path to prefix file paths:

```js
import extractFiles from 'extract-files'
import tree from './tree'

const files = extractFiles(tree, 'tree')
```

Extracted files are an array:

```js
[{
  path: 'tree.foo',
  file: /* File or Blob instance */
}, {
  path: 'tree.bar.0',
  file: /* File or Blob instance */
}, {
  path: 'tree.bar.1',
  file: /* File or Blob instance */
}]
```

`extractFiles` will return an empty array if the tree is not an object or `null`. The tree itself must not be a file.

### React Native

React Native [polyfills FormData](https://github.com/facebook/react-native/blob/v0.45.1/Libraries/Network/FormData.js) under the hood and objects with the properties `uri`, `type` and `name` substitute `window.File`. It would be risky to assume all objects with those properties in a tree are files. Use `ReactNativeFile` instances within a tree to explicitly mark files:

```js
import extractFiles, { ReactNativeFile } from 'extract-files'

const tree = {
  singleFile: new ReactNativeFile({
    uri: uriFromCameraRoll,
    type: 'image/jpeg',
    name: 'photo.jpg'
  }),
  multipleFiles: ReactNativeFile.list([
    {
      uri: uriFromCameraRoll1,
      type: 'image/jpeg',
      name: 'photo-1.jpg'
    },
    {
      uri: uriFromCameraRoll2,
      type: 'image/jpeg',
      name: 'photo-2.jpg'
    }
  ])
}

const files = extractFiles(tree)
```

### Reassembly

`object-path` can be used to loop and reinsert the extracted files:

```js
import extractFiles from 'extract-files'
import objectPath from 'object-path'
import tree from './tree'

const files = extractFiles(tree)
const treePath = objectPath(tree)

files.forEach(({ path, file }) => treePath.set(path, file))
```

`FileList` instances in an original tree become arrays when reassembled.

## Support

* Node.js v6.10+, see `package.json` `engines`.
* [Browsers >1% usage](http://browserl.ist/?q=%3E1%25), see `package.json` `browserslist`.
* React Native.
