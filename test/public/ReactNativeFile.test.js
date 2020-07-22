'use strict';

const { strictEqual } = require('assert');
const ReactNativeFile = require('../../public/ReactNativeFile.js');

module.exports = (tests) => {
  tests.add('`ReactNativeFile`.', () => {
    const uri = '<uri>';
    const name = 'a.jpg';
    const type = 'image/jpeg';
    const file = new ReactNativeFile({ uri, name, type });
    strictEqual(file.uri, uri);
    strictEqual(file.name, name);
    strictEqual(file.type, type);
  });
};
