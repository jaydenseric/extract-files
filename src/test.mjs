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

t.test('extractFiles extracts files from an object tree.', t => {
  const file = new ReactNativeFile({ name: '', type: '', uri: '' })
  const originalTree = {
    a: null,
    b: {
      ba: file,
      bb: [file, file]
    },
    c: {
      ca: '',
      cb: {
        cba: true
      }
    }
  }
  const files = extractFiles(originalTree)

  t.deepEqual(
    originalTree,
    {
      a: null,
      b: {
        ba: null,
        bb: [null, null]
      },
      c: {
        ca: '',
        cb: {
          cba: true
        }
      }
    },
    'Files removed from original object tree.'
  )

  t.deepEqual(
    files,
    [
      { path: 'b.ba', file },
      { path: 'b.bb.0', file },
      { path: 'b.bb.1', file }
    ],
    'Returns array of extracted files.'
  )

  t.end()
})

t.test(
  'extractFiles with a tree path extracts files from an object tree.',
  t => {
    const file = new ReactNativeFile({ name: '', type: '', uri: '' })
    const originalTree = {
      a: null,
      b: {
        ba: file,
        bb: [file, file]
      },
      c: {
        ca: '',
        cb: {
          cba: true
        }
      }
    }
    const files = extractFiles(originalTree, 'treepath')

    t.deepEqual(
      originalTree,
      {
        a: null,
        b: {
          ba: null,
          bb: [null, null]
        },
        c: {
          ca: '',
          cb: {
            cba: true
          }
        }
      },
      'Files removed from original object tree.'
    )

    t.deepEqual(
      files,
      [
        { path: 'treepath.b.ba', file },
        { path: 'treepath.b.bb.0', file },
        { path: 'treepath.b.bb.1', file }
      ],
      'Returns array of extracted files.'
    )

    t.end()
  }
)
