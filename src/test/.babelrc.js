'use strict';

module.exports = {
  comments: false,
  plugins: ['transform-require-extensions'],
  presets: [
    [
      '@babel/env',
      {
        targets: { node: true },
        modules: process.env.PREPARE_MODULE_TYPE === 'esm' ? false : 'cjs',
        shippedProposals: true,
        loose: true,
      },
    ],
  ],
};
