// @ts-check

import { strictEqual } from "assert";
import revertableGlobals from "revertable-globals";
import ReactNativeFile from "./ReactNativeFile.mjs";
import isExtractableFile from "./isExtractableFile.mjs";
import assertBundleSize from "./test/assertBundleSize.mjs";

/**
 * Adds `isExtractableFile` tests.
 * @param {import("test-director").default} tests Test director.
 */
export default (tests) => {
  tests.add("`isExtractableFile` bundle size.", async () => {
    await assertBundleSize(
      new URL("./isExtractableFile.mjs", import.meta.url),
      180
    );
  });

  tests.add("`isExtractableFile` with a `File` instance.", () => {
    class File {}

    const revertGlobals = revertableGlobals({ File });

    try {
      strictEqual(isExtractableFile(new File()), true);
    } finally {
      revertGlobals();
    }
  });

  tests.add("`isExtractableFile` with a `Blob` instance.", () => {
    class Blob {}

    const revertGlobals = revertableGlobals({ Blob });

    try {
      strictEqual(isExtractableFile(new Blob()), true);
    } finally {
      revertGlobals();
    }
  });

  tests.add("`isExtractableFile` with a `ReactNativeFile` instance.", () => {
    strictEqual(
      isExtractableFile(new ReactNativeFile({ uri: "", name: "", type: "" })),
      true
    );
  });

  tests.add("`isExtractableFile` with a non-file.", () => {
    strictEqual(isExtractableFile({}), false);
  });
};
