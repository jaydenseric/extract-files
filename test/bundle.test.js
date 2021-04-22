'use strict';

const { strictEqual } = require('assert');
const { resolve } = require('path');
const { build } = require('esbuild');
const gzipSize = require('gzip-size');

module.exports = (tests) => {
  tests.add('Bundle.', async () => {
    const {
      outputFiles: [bundle],
    } = await build({
      entryPoints: [resolve(__dirname, '../public/index.js')],
      write: false,
      bundle: true,
      minify: true,
    });

    const kB = (await gzipSize(bundle.contents)) / 1000;

    console.info(`${kB} kB minified and gzipped bundle.`);

    strictEqual(kB < 0.6, true);
  });
};
