'use strict'

module.exports = {
  comments: false,
  plugins: ['transform-require-extensions'],
  presets: [
    [
      '@babel/env',
      {
        modules: process.env.BABEL_ESM ? false : 'commonjs',
        shippedProposals: true,
        loose: true,
      },
    ],
  ],
}
