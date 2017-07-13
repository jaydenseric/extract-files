import test from 'ava'
import { isObject, extractFiles, ReactNativeFile } from '../src/index.js'

test('isObject identifies an enumerable object', t => {
  t.false(isObject(null))
  t.false(isObject(true))
  t.false(isObject(''))
  t.true(isObject({ foo: true }))
  t.true(isObject(['foo']))
})

test('extractFiles handles a non-object tree', t => {
  t.deepEqual(extractFiles(undefined), [])
  t.deepEqual(extractFiles(null), [])
})

test('extractFiles extracts files from an object tree', t => {
  const file = new ReactNativeFile({ name: '', type: '', uri: '' })
  const tree = {
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
  const files = extractFiles(tree, 'treepath')

  t.deepEqual(
    tree,
    {
      a: null,
      b: {
        bb: [undefined, undefined]
      },
      c: {
        ca: '',
        cb: {
          cba: true
        }
      }
    },
    'Extracted files should be removed from the original object tree'
  )

  t.deepEqual(
    files,
    [
      {
        path: 'treepath.b.ba',
        file
      },
      {
        path: 'treepath.b.bb.0',
        file
      },
      {
        path: 'treepath.b.bb.1',
        file
      }
    ],
    'Should return an array of the extracted files'
  )
})
