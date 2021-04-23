import { strictEqual } from 'assert';
import revertableGlobals from 'revertable-globals';
import ReactNativeFile from '../../public/ReactNativeFile.js';
import isExtractableFile from '../../public/isExtractableFile.js';

export default (tests) => {
  tests.add('`isExtractableFile` with a `File` instance.', () => {
    class File {}

    const revertGlobals = revertableGlobals({ File });

    try {
      strictEqual(isExtractableFile(new File()), true);
    } finally {
      revertGlobals();
    }
  });

  tests.add('`isExtractableFile` with a `Blob` instance.', () => {
    class Blob {}

    const revertGlobals = revertableGlobals({ Blob });

    try {
      strictEqual(isExtractableFile(new Blob()), true);
    } finally {
      revertGlobals();
    }
  });

  tests.add('`isExtractableFile` with a `ReactNativeFile` instance.', () => {
    strictEqual(
      isExtractableFile(new ReactNativeFile({ uri: '', name: '', type: '' })),
      true
    );
  });

  tests.add('`isExtractableFile` with a non-file.', () => {
    strictEqual(isExtractableFile({}), false);
  });
};
