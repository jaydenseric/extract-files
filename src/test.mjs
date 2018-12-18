import t from 'tap'
import { extractFiles } from './extractFiles'
import { isObject } from './isObject'
import { ReactNativeFile } from './ReactNativeFile'

// eslint-disable-next-line no-console
console.log(
  `Testing ${
    process.execArgv.includes('--experimental-modules') ? 'ESM' : 'CJS'
  } library with ${process.env.NODE_ENV} NODE_ENV…\n\n`
)

t.test('isObject only identifies an enumerable object.', t => {
  t.false(isObject(null), 'Null.')
  t.false(isObject(true), 'Boolean.')
  t.false(isObject(''), 'String.')
  t.true(isObject({ foo: true }), 'Object.')
  t.true(isObject(['']), 'Array.')
  t.end()
})

t.test('extractFiles handles a non-object tree.', t => {
  t.deepEqual(extractFiles(undefined), [], 'Undefined.')
  t.deepEqual(extractFiles(null), [], 'Null.')
  t.end()
})

t.test('extractFiles handles an empty object tree.', t => {
  t.deepEqual(extractFiles({}), [], 'Returns empty array.')
  t.end()
})

t.test(
  'extractFiles handles an object tree with various property types.',
  t => {
    const tree = {
      a: '',
      b: 1,
      c: true,
      d: null
    }
    const files = extractFiles(tree)

    t.deepEqual(
      tree,
      {
        a: '',
        b: 1,
        c: true,
        d: null
      },
      'Unmodified tree.'
    )

    t.deepEqual(files, [], 'Returned array.')

    t.end()
  }
)

t.test('extractFiles extracts files from an array tree.', t => {
  const file = new ReactNativeFile({ name: '', type: '', uri: '' })
  const tree = [
    file,
    {
      a: {
        a: file,
        b: [file, file]
      }
    }
  ]
  const files = extractFiles(tree)

  t.deepEqual(
    tree,
    [
      null,
      {
        a: {
          a: null,
          b: [null, null]
        }
      }
    ],
    'Modified tree.'
  )

  t.deepEqual(
    files,
    [
      { path: '0', file },
      { path: '1.a.a', file },
      { path: '1.a.b.0', file },
      { path: '1.a.b.1', file }
    ],
    'Returned array.'
  )

  t.end()
})

t.test('extractFiles extracts files from an object tree.', t => {
  const file = new ReactNativeFile({ name: '', type: '', uri: '' })
  const tree = {
    a: {
      a: file,
      b: [file, file]
    }
  }
  const files = extractFiles(tree)

  t.deepEqual(
    tree,
    {
      a: {
        a: null,
        b: [null, null]
      }
    },
    'Modified tree.'
  )

  t.deepEqual(
    files,
    [{ path: 'a.a', file }, { path: 'a.b.0', file }, { path: 'a.b.1', file }],
    'Returned array.'
  )

  t.end()
})

t.test(
  'extractFiles extracts files from an object tree with a tree path.',
  t => {
    const file = new ReactNativeFile({ name: '', type: '', uri: '' })
    const tree = {
      a: {
        a: file,
        b: [file, file]
      }
    }
    const files = extractFiles(tree, 'treepath')

    t.deepEqual(
      tree,
      {
        a: {
          a: null,
          b: [null, null]
        }
      },
      'Modified tree.'
    )

    t.deepEqual(
      files,
      [
        { path: 'treepath.a.a', file },
        { path: 'treepath.a.b.0', file },
        { path: 'treepath.a.b.1', file }
      ],
      'Returned array.'
    )

    t.end()
  }
)
