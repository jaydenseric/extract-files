'use strict'

module.exports = {
  comments: false,
  plugins: [
    ['@babel/proposal-class-properties', { loose: true }],
    'transform-require-extensions'
  ],
  presets: [
    [
      '@babel/env',
      {
        modules: process.env.BABEL_ESM ? false : 'commonjs',
        shippedProposals: true,
        loose: true
      }
    ]
  ]
}
