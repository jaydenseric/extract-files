import t from 'tap'
import { extractFiles } from './extractFiles'
import { ReactNativeFile } from './ReactNativeFile'

// eslint-disable-next-line no-console
console.log(
  `Testing ${
    process.execArgv.includes('--experimental-modules') ? 'ESM' : 'CJS'
  } library with ${process.env.NODE_ENV} NODE_ENV…\n\n`
)

t.test('Extracts a file value.', t => {
  const file = new ReactNativeFile({ name: '', type: '', uri: '' })

  t.strictDeepEqual(
    extractFiles(file),
    {
      clone: null,
      files: [{ path: '', file }]
    },
    'Result.'
  )

  t.end()
})

t.test(
  'Extracts File instances from a FileList instance in an object value.',
  t => {
    const originalFile = global.File
    const originalFileList = global.FileList

    global.File = class File {}
    global.FileList = class FileList {
      // eslint-disable-next-line require-jsdoc
      constructor(files) {
        files.forEach((file, i) => {
          this[i] = file
        })
        this.length = files.length
      }
    }

    const file1 = new File()
    const file2 = new File()
    const fileList = new FileList([file1, file2])

    t.strictDeepEqual(
      extractFiles({ a: fileList }),
      {
        clone: { a: [null, null] },
        files: [{ path: 'a.0', file: file1 }, { path: 'a.1', file: file2 }]
      },
      'Result.'
    )

    global.File = originalFile
    global.FileList = originalFileList

    t.end()
  }
)

t.test('Extracts a File instance in an object value.', t => {
  const original = global.File
  global.File = class File {}
  const file = new File()

  t.strictDeepEqual(
    extractFiles({ a: file }),
    {
      clone: { a: null },
      files: [{ path: 'a', file }]
    },
    'Result.'
  )

  global.File = original

  t.end()
})

t.test('Extracts a Blob instance in an object value.', t => {
  const original = global.Blob
  global.Blob = class Blob {}
  const file = new Blob()

  t.strictDeepEqual(
    extractFiles({ a: file }),
    {
      clone: { a: null },
      files: [{ path: 'a', file }]
    },
    'Result.'
  )

  global.Blob = original

  t.end()
})

t.test('Extracts a ReactNativeFile instance in an object value.', t => {
  const file = new ReactNativeFile({ name: '', type: '', uri: '' })

  t.strictDeepEqual(
    extractFiles({ a: file }),
    {
      clone: { a: null },
      files: [{ path: 'a', file }]
    },
    'Result.'
  )

  t.end()
})

t.test('Extracts files from an array value.', t => {
  const file = new ReactNativeFile({ name: '', type: '', uri: '' })

  t.strictDeepEqual(
    extractFiles([file, file]),
    {
      clone: [null, null],
      files: [{ path: '0', file }, { path: '1', file }]
    },
    'Result.'
  )

  t.end()
})

t.test('Extracts files from a nested array value.', t => {
  const file = new ReactNativeFile({ name: '', type: '', uri: '' })

  t.strictDeepEqual(
    extractFiles({ a: [file, file] }),
    {
      clone: { a: [null, null] },
      files: [{ path: 'a.0', file }, { path: 'a.1', file }]
    },
    'Result.'
  )

  t.end()
})

t.test('Extracts files in an object value.', t => {
  const file = new ReactNativeFile({ name: '', type: '', uri: '' })

  t.strictDeepEqual(
    extractFiles({ a: file, b: file }),
    {
      clone: { a: null, b: null },
      files: [{ path: 'a', file }, { path: 'b', file }]
    },
    'Result.'
  )

  t.end()
})

t.test('Extracts files from a nested object value.', t => {
  const file = new ReactNativeFile({ name: '', type: '', uri: '' })

  t.strictDeepEqual(
    extractFiles({ a: { a: file, b: file } }),
    {
      clone: { a: { a: null, b: null } },
      files: [{ path: 'a.a', file }, { path: 'a.b', file }]
    },
    'Result.'
  )

  t.end()
})

t.test('Extracts files with a path.', t => {
  const file = new ReactNativeFile({ name: '', type: '', uri: '' })

  t.strictDeepEqual(
    extractFiles({ a: [file, { a: file }] }, 'prefix'),
    {
      clone: { a: [null, { a: null }] },
      files: [{ path: 'prefix.a.0', file }, { path: 'prefix.a.1.a', file }]
    },
    'Result.'
  )

  t.end()
})

t.test('Handles an undefined value.', t => {
  t.strictDeepEqual(
    extractFiles(undefined),
    { clone: undefined, files: [] },
    'Result.'
  )
  t.end()
})

t.test('Handles a null value.', t => {
  t.strictDeepEqual(extractFiles(null), { clone: null, files: [] }, 'Result.')
  t.end()
})

t.test('Handles an empty object value.', t => {
  t.strictDeepEqual(extractFiles({}), { clone: {}, files: [] }, 'Result.')
  t.end()
})

t.test('Handles an object value with various property types.', t => {
  t.strictDeepEqual(
    extractFiles({
      a: '',
      b: 1,
      c: true,
      d: false,
      e: null,
      f: undefined
    }),
    {
      clone: {
        a: '',
        b: 1,
        c: true,
        d: false,
        e: null,
        f: undefined
      },
      files: []
    },
    'Result.'
  )

  t.end()
})
