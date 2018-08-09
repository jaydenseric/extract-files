const {
  engines: { node }
} = require('./package.json')

module.exports = {
  comments: false,
  presets: [
    [
      '@babel/env',
      {
        targets: {
          node: node.substring(2) // Strip `>=`
        },
        shippedProposals: true,
        modules: process.env.MODULE ? false : 'commonjs',
        useBuiltIns: 'usage',
        loose: true
      }
    ]
  ],
  plugins: [
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/transform-runtime', { polyfill: false, regenerator: false }]
  ]
}
