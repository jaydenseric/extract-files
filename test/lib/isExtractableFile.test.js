'use strict';

const { strictEqual } = require('assert');
const ReactNativeFile = require('../../lib/ReactNativeFile.js');
const isExtractableFile = require('../../lib/isExtractableFile.js');

module.exports = (tests) => {
  tests.add('`isExtractableFile` with a `File` instance.', () => {
    const original = global.File;
    global.File = class File {};
    strictEqual(isExtractableFile(new File()), true);
    global.File = original;
  });

  tests.add('`isExtractableFile` with a `Blob` instance.', () => {
    const original = global.Blob;
    global.Blob = class Blob {};
    strictEqual(isExtractableFile(new Blob()), true);
    global.Blob = original;
  });

  tests.add('`isExtractableFile` with a `ReactNativeFile` instance.', () => {
    strictEqual(
      isExtractableFile(new ReactNativeFile({ uri: '', name: '', type: '' })),
      true
    );
  });

  tests.add('`isExtractableFile` with a non-file.', () => {
    strictEqual(isExtractableFile({}), false);
  });
};