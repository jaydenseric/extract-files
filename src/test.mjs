import t from 'tap'
import { extractFiles } from './extractFiles'
import { isFileValue } from './isFileValue'
import { ReactNativeFile } from './ReactNativeFile'

// eslint-disable-next-line no-console
console.log(
  `Testing ${
    process.execArgv.includes('--experimental-modules') ? 'ESM' : 'CJS'
  } library with ${process.env.NODE_ENV} NODE_ENV…\n\n`
)

t.test('isFileValue can determine that a value is a file', t => {
  const file = new ReactNativeFile({ name: '', type: '', uri: '' })
  t.equal(isFileValue(file), true)
  t.end()
})

t.test('isFileValue can determine that a value is not a file', t => {
  const notAFile = {}
  t.equal(isFileValue(notAFile), false)
  t.end()
})

t.test('Extracts a file value.', t => {
  const file = new ReactNativeFile({ name: '', type: '', uri: '' })

  t.strictDeepEqual(
    extractFiles(file),
    {
      clone: null,
      files: new Map([[file, ['']]])
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
        files: new Map([[file1, ['a.0']], [file2, ['a.1']]])
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
      files: new Map([[file, ['a']]])
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
      files: new Map([[file, ['a']]])
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
      files: new Map([[file, ['a']]])
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
      files: new Map([[file, ['0', '1']]])
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
      files: new Map([[file, ['a.0', 'a.1']]])
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
      files: new Map([[file, ['a', 'b']]])
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
      files: new Map([[file, ['a.a', 'a.b']]])
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
      files: new Map([[file, ['prefix.a.0', 'prefix.a.1.a']]])
    },
    'Result.'
  )

  t.end()
})

t.test('Handles an undefined value.', t => {
  t.strictDeepEqual(
    extractFiles(undefined),
    { clone: undefined, files: new Map() },
    'Result.'
  )
  t.end()
})

t.test('Handles a null value.', t => {
  t.strictDeepEqual(
    extractFiles(null),
    { clone: null, files: new Map() },
    'Result.'
  )
  t.end()
})

t.test('Handles an instance value.', t => {
  const dateInstance = new Date(2019, 0, 20)

  t.strictDeepEqual(
    extractFiles(dateInstance),
    { clone: dateInstance, files: new Map() },
    'Result.'
  )
  t.end()
})

t.test('Handles an empty object value.', t => {
  t.strictDeepEqual(
    extractFiles({}),
    { clone: {}, files: new Map() },
    'Result.'
  )
  t.end()
})

t.test('Handles an object value with various property types.', t => {
  // eslint-disable-next-line require-jsdoc
  const func = () => {}
  const dateInstance = new Date(2019, 0, 20)
  const numberInstance = new Number(1)
  // eslint-disable-next-line require-jsdoc
  class Class {
    a = true
  }
  const classInstance = new Class()
  const objectInstance = new Object()
  objectInstance.a = true

  t.strictDeepEqual(
    extractFiles({
      a: '',
      b: 'a',
      c: 0,
      d: 1,
      e: true,
      f: false,
      g: null,
      h: undefined,
      i: func,
      j: objectInstance,
      k: classInstance,
      l: numberInstance,
      m: dateInstance
    }),
    {
      clone: {
        a: '',
        b: 'a',
        c: 0,
        d: 1,
        e: true,
        f: false,
        g: null,
        h: undefined,
        i: func,
        j: objectInstance,
        k: classInstance,
        l: numberInstance,
        m: dateInstance
      },
      files: new Map()
    },
    'Result.'
  )

  t.end()
})

t.test('Allows overwriting isFileValue', t => {
  // eslint-disable-next-line require-jsdoc
  class CustomFile {}
  // eslint-disable-next-line require-jsdoc
  function newIsFileValue(value) {
    return value instanceof CustomFile
  }

  const file = new CustomFile()
  const file1 = new CustomFile()
  const file2 = new CustomFile()

  t.strictDeepEqual(
    extractFiles({ a: file, b: [file1, { c: file2 }] }, '', newIsFileValue),
    {
      clone: {
        a: null,
        b: [
          null,
          {
            c: null
          }
        ]
      },
      files: new Map([[file, ['a']], [file1, ['b.0']], [file2, ['b.1.c']]])
    },
    'Result.'
  )

  t.end()
})
