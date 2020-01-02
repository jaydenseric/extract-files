import t from 'tap'
import { ReactNativeFile } from './ReactNativeFile.mjs'
import { extractFiles } from './extractFiles.mjs'
import { isExtractableFile } from './isExtractableFile.mjs'

t.test('`isExtractableFile` matches a file', t => {
  const file = new ReactNativeFile({ name: '', type: '', uri: '' })
  t.equal(isExtractableFile(file), true)
  t.end()
})

t.test('`isExtractableFile` doesn’t match a non-file', t => {
  const notAFile = {}
  t.equal(isExtractableFile(notAFile), false)
  t.end()
})

t.test('`extractFiles` extracts a file value.', t => {
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
  '`extractFiles` extracts `File` instances from a `FileList` instance in an object value.',
  t => {
    const originalFile = global.File
    const originalFileList = global.FileList

    global.File = class File {}
    global.FileList = class FileList {
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
        files: new Map([
          [file1, ['a.0']],
          [file2, ['a.1']]
        ])
      },
      'Result.'
    )

    global.File = originalFile
    global.FileList = originalFileList

    t.end()
  }
)

t.test('`extractFiles` extracts a `File` instance in an object value.', t => {
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

t.test('`extractFiles` extracts a `Blob` instance in an object value.', t => {
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

t.test(
  '`extractFiles` extracts a `ReactNativeFile` instance in an object value.',
  t => {
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
  }
)

t.test('`extractFiles` extracts files from an array value.', t => {
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

t.test('`extractFiles` extracts files from a nested array value.', t => {
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

t.test('`extractFiles` extracts files in an object value.', t => {
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

t.test('`extractFiles` extracts files from a nested object value.', t => {
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

t.test('`extractFiles` extracts files with a path.', t => {
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

t.test('`extractFiles` handles an undefined value.', t => {
  t.strictDeepEqual(
    extractFiles(undefined),
    { clone: undefined, files: new Map() },
    'Result.'
  )
  t.end()
})

t.test('`extractFiles` handles a null value.', t => {
  t.strictDeepEqual(
    extractFiles(null),
    { clone: null, files: new Map() },
    'Result.'
  )
  t.end()
})

t.test('`extractFiles` handles an instance value.', t => {
  const dateInstance = new Date(2019, 0, 20)

  t.strictDeepEqual(
    extractFiles(dateInstance),
    { clone: dateInstance, files: new Map() },
    'Result.'
  )
  t.end()
})

t.test('`extractFiles` handles an empty object value.', t => {
  t.strictDeepEqual(
    extractFiles({}),
    { clone: {}, files: new Map() },
    'Result.'
  )
  t.end()
})

t.test(
  '`extractFiles` handles an object value with various property types.',
  t => {
    const func = () => {}
    const dateInstance = new Date(2019, 0, 20)
    const numberInstance = new Number(1)
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
  }
)

t.test('`extractFiles` allows overriding `isExtractableFile`.', t => {
  class CustomFile {}

  const isExtractableFile = value => value instanceof CustomFile

  const file1 = new CustomFile()
  const file2 = new CustomFile()
  const file3 = new CustomFile()

  t.strictDeepEqual(
    extractFiles(
      {
        a: file1,
        b: [file2, { c: file3 }]
      },
      '',
      isExtractableFile
    ),
    {
      clone: {
        a: null,
        b: [null, { c: null }]
      },
      files: new Map([
        [file1, ['a']],
        [file2, ['b.0']],
        [file3, ['b.1.c']]
      ])
    },
    'Result.'
  )

  t.end()
})
