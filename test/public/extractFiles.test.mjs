import { deepStrictEqual } from 'assert';
import revertableGlobals from 'revertable-globals';
import ReactNativeFile from '../../public/ReactNativeFile.js';
import extractFiles from '../../public/extractFiles.js';

export default (tests) => {
  for (const [name, value] of [
    ['undefined', undefined],
    ['null', null],
    ['false', false],
    ['true', true],
    ['a falsy string', ''],
    ['a truthy string', 'a'],
    ['a falsy number', 0],
    ['a truthy number', 1],
    ['an empty object', {}],
    ['an empty array', []],
    ['a function', () => {}],
    ['an `Object` instance', new Object()],
    ['a `Number` instance', new Number(1)],
    ['a `Date` instance', new Date(2019, 0, 20)],
  ])
    tests.add(`\`extractFiles\` with ${name}.`, () => {
      deepStrictEqual(extractFiles(value), {
        clone: value,
        files: new Map(),
      });
      deepStrictEqual(extractFiles(Object.freeze({ a: value })), {
        clone: { a: value },
        files: new Map(),
      });
      deepStrictEqual(extractFiles(Object.freeze([value])), {
        clone: [value],
        files: new Map(),
      });
    });

  tests.add('`extractFiles` with a `FileList` instance.', () => {
    class File {}
    class FileList {
      constructor(files) {
        files.forEach((file, i) => {
          this[i] = file;
        });
        this.length = files.length;
      }
    }

    const revertGlobals = revertableGlobals({ File, FileList });

    try {
      const file0 = new File();
      const file1 = new File();
      const fileList = new FileList([file0, file1]);

      deepStrictEqual(extractFiles(fileList), {
        clone: [null, null],
        files: new Map([
          [file0, ['0']],
          [file1, ['1']],
        ]),
      });
    } finally {
      revertGlobals();
    }
  });

  tests.add('`extractFiles` with a `File` instance.', () => {
    class File {}

    const revertGlobals = revertableGlobals({ File });

    try {
      const file = new File();

      deepStrictEqual(extractFiles(file), {
        clone: null,
        files: new Map([[file, ['']]]),
      });
    } finally {
      revertGlobals();
    }
  });

  tests.add('`extractFiles` with a `Blob` instance.', () => {
    class Blob {}

    const revertGlobals = revertableGlobals({ Blob });

    try {
      const file = new Blob();

      deepStrictEqual(extractFiles(file), {
        clone: null,
        files: new Map([[file, ['']]]),
      });
    } finally {
      revertGlobals();
    }
  });

  tests.add('`extractFiles` with a `ReactNativeFile` instance.', () => {
    const file = new ReactNativeFile({ uri: '', name: '', type: '' });

    deepStrictEqual(extractFiles(file), {
      clone: null,
      files: new Map([[file, ['']]]),
    });
  });

  tests.add(
    '`extractFiles` with an object containing multiple references of a file.',
    () => {
      const file = new ReactNativeFile({ uri: '', name: '', type: '' });

      deepStrictEqual(extractFiles(Object.freeze({ a: file, b: file })), {
        clone: { a: null, b: null },
        files: new Map([[file, ['a', 'b']]]),
      });
    }
  );

  tests.add('`extractFiles` with an object containing multiple files.', () => {
    const fileA = new ReactNativeFile({ uri: '', name: '', type: '' });
    const fileB = new ReactNativeFile({ uri: '', name: '', type: '' });

    deepStrictEqual(extractFiles(Object.freeze({ a: fileA, b: fileB })), {
      clone: { a: null, b: null },
      files: new Map([
        [fileA, ['a']],
        [fileB, ['b']],
      ]),
    });
  });

  tests.add('`extractFiles` with a nested object containing a file.', () => {
    const file = new ReactNativeFile({ uri: '', name: '', type: '' });

    deepStrictEqual(
      extractFiles(Object.freeze({ a: Object.freeze({ a: file }) })),
      {
        clone: { a: { a: null } },
        files: new Map([[file, ['a.a']]]),
      }
    );
  });

  tests.add(
    '`extractFiles` with an array containing multiple references of a file.',
    () => {
      const file = new ReactNativeFile({ uri: '', name: '', type: '' });

      deepStrictEqual(extractFiles(Object.freeze([file, file])), {
        clone: [null, null],
        files: new Map([[file, ['0', '1']]]),
      });
    }
  );

  tests.add('`extractFiles` with an array containing multiple files.', () => {
    const file0 = new ReactNativeFile({ uri: '', name: '', type: '' });
    const file1 = new ReactNativeFile({ uri: '', name: '', type: '' });

    deepStrictEqual(extractFiles(Object.freeze([file0, file1])), {
      clone: [null, null],
      files: new Map([
        [file0, ['0']],
        [file1, ['1']],
      ]),
    });
  });

  tests.add('`extractFiles` with a nested array containing a file.', () => {
    const file = new ReactNativeFile({ uri: '', name: '', type: '' });

    deepStrictEqual(extractFiles(Object.freeze([Object.freeze([file])])), {
      clone: [[null]],
      files: new Map([[file, ['0.0']]]),
    });
  });

  tests.add('`extractFiles` with a second `path` parameter, file.', () => {
    const file = new ReactNativeFile({ uri: '', name: '', type: '' });

    deepStrictEqual(extractFiles(file, 'prefix'), {
      clone: null,
      files: new Map([[file, ['prefix']]]),
    });
  });

  tests.add(
    '`extractFiles` with a second `path` parameter, file nested in an object and array.',
    () => {
      const file = new ReactNativeFile({ uri: '', name: '', type: '' });

      deepStrictEqual(extractFiles({ a: [file] }, 'prefix'), {
        clone: { a: [null] },
        files: new Map([[file, ['prefix.a.0']]]),
      });
    }
  );

  tests.add(
    '`extractFiles` with a third `isExtractableFile` parameter.',
    () => {
      class CustomFile {}

      const file = new CustomFile();

      deepStrictEqual(
        extractFiles(file, '', (value) => value instanceof CustomFile),
        {
          clone: null,
          files: new Map([[file, ['']]]),
        }
      );
    }
  );
};
