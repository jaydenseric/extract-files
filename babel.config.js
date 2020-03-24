'use strict'

const config = {
  comments: false,
  plugins: ['transform-require-extensions'],
  presets: [
    [
      '@babel/env',
      {
        modules: process.env.PREPARE_MODULE_TYPE === 'esm' ? false : 'cjs',
        shippedProposals: true,
        loose: true,
      },
    ],
  ],
}

if (process.env.PREPARE_MODULE_TYPE)
  config.ignore = [
    `./src/index.${process.env.PREPARE_MODULE_TYPE === 'esm' ? 'js' : 'mjs'}`,
  ]

module.exports = config
