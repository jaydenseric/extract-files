// @ts-check

import { strictEqual } from "node:assert";
import { describe, it } from "node:test";
import revertableGlobals from "revertable-globals";

import isExtractableFile from "./isExtractableFile.mjs";
import assertBundleSize from "./test-helpers/assertBundleSize.mjs";

describe(
  "Function `isExtractableFile`.",
  {
    concurrency: true,
  },
  () => {
    it("Bundle size.", async () => {
      await assertBundleSize(
        new URL("./isExtractableFile.mjs", import.meta.url),
        120,
      );
    });

    it("With a `File` instance.", () => {
      class File {}

      const revertGlobals = revertableGlobals({ File });

      try {
        strictEqual(isExtractableFile(new File()), true);
      } finally {
        revertGlobals();
      }
    });

    it("With a `Blob` instance.", () => {
      class Blob {}

      const revertGlobals = revertableGlobals({ Blob });

      try {
        strictEqual(isExtractableFile(new Blob()), true);
      } finally {
        revertGlobals();
      }
    });

    it("With a non-file.", () => {
      strictEqual(isExtractableFile({}), false);
    });
  },
);
