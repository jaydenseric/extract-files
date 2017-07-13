import babel from 'rollup-plugin-babel'

const pkg = require('./package.json')

export default {
  entry: 'test/index.js',
  external: path =>
    Object.keys(pkg.dependencies).some(name => path.startsWith(name)) ||
    Object.keys(pkg.devDependencies).some(name => path.startsWith(name)),
  plugins: [
    babel({
      runtimeHelpers: true
    })
  ],
  dest: 'test/bundle.js',
  format: 'cjs',
  sourceMap: true
}
