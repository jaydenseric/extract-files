// @ts-check

import { deepStrictEqual, notStrictEqual, strictEqual, throws } from "assert";
import revertableGlobals from "revertable-globals";
import ReactNativeFile from "./ReactNativeFile.mjs";
import extractFiles from "./extractFiles.mjs";
import isExtractableFile from "./isExtractableFile.mjs";
import assertBundleSize from "./test/assertBundleSize.mjs";

/**
 * Adds `extractFiles` tests.
 * @param {import("test-director").default} tests Test director.
 */
export default (tests) => {
  tests.add("`extractFiles` bundle size.", async () => {
    await assertBundleSize(new URL("./extractFiles.mjs", import.meta.url), 550);
  });

  tests.add("`extractFiles` with argument 1 `value` missing.", () => {
    throws(() => {
      // @ts-expect-error Testing invalid.
      extractFiles();
    }, new TypeError("Argument 1 `value` is required."));
  });

  tests.add(
    "`extractFiles` with argument 2 `isExtractable` not a function.",
    () => {
      throws(() => {
        extractFiles(
          null,
          // @ts-expect-error Testing invalid.
          true
        );
      }, new TypeError("Argument 2 `isExtractable` must be a function."));
    }
  );

  tests.add("`extractFiles` with argument 3 `path` not a string.", () => {
    throws(() => {
      extractFiles(
        null,
        isExtractableFile,
        // @ts-expect-error Testing invalid.
        true
      );
    }, new TypeError("Argument 3 `path` must be a string."));
  });

  tests.add(
    "`extractFiles` with argument 2 `isExtractable` returning a type predicate.",
    () => {
      class CustomFile {}

      const file = new CustomFile();

      /**
       * Checks if a value is a {@linkcode CustomFile}.
       * @param {unknown} value Value to check.
       * @returns {value is CustomFile} Is the value a {@linkcode CustomFile}.
       */
      const isCustomFile = (value) => value instanceof CustomFile;

      /** @type {import("./extractFiles.mjs").Extraction<CustomFile>} */
      const extraction = extractFiles(file, isCustomFile);

      deepStrictEqual(extraction, {
        clone: null,
        files: new Map([[file, [""]]]),
      });
    }
  );

  tests.add(
    "`extractFiles` with argument 2 `isExtractable` returning a boolean.",
    () => {
      class CustomFile {}

      const file = new CustomFile();

      /** @type {import("./extractFiles.mjs").Extraction<unknown>} */
      const extraction = extractFiles(
        file,
        (value) => value instanceof CustomFile
      );

      deepStrictEqual(extraction, {
        clone: null,
        files: new Map([[file, [""]]]),
      });
    }
  );

  tests.add("`extractFiles` with argument 3 `path` specified, file.", () => {
    const file = new ReactNativeFile({ uri: "", name: "", type: "" });

    deepStrictEqual(extractFiles(file, isExtractableFile, "prefix"), {
      clone: null,
      files: new Map([[file, ["prefix"]]]),
    });
  });

  tests.add(
    "`extractFiles` with argument 3 `path` specified, file nested in an object and array.",
    () => {
      const file = new ReactNativeFile({ uri: "", name: "", type: "" });

      deepStrictEqual(
        extractFiles({ a: [file] }, isExtractableFile, "prefix"),
        {
          clone: { a: [null] },
          files: new Map([[file, ["prefix.a.0"]]]),
        }
      );
    }
  );

  for (const [name, value] of [
    ["undefined", undefined],
    ["null", null],
    ["false", false],
    ["true", true],
    ["a string, falsy", ""],
    ["a string, truthy", "a"],
    ["a number, falsy", 0],
    ["a number, truthy", 1],
    ["a number, NaN", Number.NaN],
    ["a number, `Number` instance", new Number(1)],
    ["a regex", /./u],
    ["an object, `Object` instance", { a: 1 }],
    [
      "an object, non `Object` instance",
      Object.assign(Object.create(null), { a: 1 }),
    ],
    ["an object, intrinsic", Math],
    ["an array", [1, 2]],
    ["a function", () => {}],
    ["a class instance", new Date()],
  ]) {
    const label = `\`extractFiles\` with ${name},`;

    tests.add(`${label} directly.`, () => {
      deepStrictEqual(extractFiles(value, isExtractableFile), {
        clone: value,
        files: new Map(),
      });
    });

    tests.add(`${label} in an object, \`Object\` instance.`, () => {
      const object = Object.freeze({ a: value });
      const extraction = extractFiles(object, isExtractableFile);

      deepStrictEqual(extraction, {
        clone: object,
        files: new Map(),
      });
      notStrictEqual(extraction.clone, object);
    });

    tests.add(`${label} in an object, non \`Object\` instance.`, () => {
      const object = Object.freeze(
        Object.assign(Object.create(null), { a: value })
      );
      const extraction = extractFiles(object, isExtractableFile);

      deepStrictEqual(extraction, {
        clone: object,
        files: new Map(),
      });
      notStrictEqual(extraction.clone, object);
    });

    tests.add(`${label} in an array.`, () => {
      const array = Object.freeze([value]);
      const extraction = extractFiles(array, isExtractableFile);

      deepStrictEqual(extraction, {
        clone: array,
        files: new Map(),
      });
      notStrictEqual(extraction.clone, array);
    });
  }

  tests.add("`extractFiles` with a `FileList` instance.", () => {
    class File {}
    class FileList {
      #files;

      /**
       * @param {Array<File>} files Files.
       * @this {{
       *   #files: Array<File>,
       *   [index: number]: File,
       *   [Symbol.iterator](): IterableIterator<File>,
       *   length: number
       * }}
       */
      constructor(files) {
        this.#files = files;

        files.forEach((file, index) => {
          this[index] = file;
        });

        this[Symbol.iterator] = this.#files[Symbol.iterator];
        this.length = this.#files.length;
      }
    }

    const revertGlobals = revertableGlobals({ File, FileList });

    try {
      const file0 = new File();
      const file1 = new File();
      const fileList = new FileList([file0, file1]);

      deepStrictEqual(extractFiles(fileList, isExtractableFile), {
        clone: [null, null],
        files: new Map([
          [file0, ["0"]],
          [file1, ["1"]],
        ]),
      });
    } finally {
      revertGlobals();
    }
  });

  tests.add("`extractFiles` with a `File` instance.", () => {
    class File {}

    const revertGlobals = revertableGlobals({ File });

    try {
      const file = new File();

      deepStrictEqual(extractFiles(file, isExtractableFile), {
        clone: null,
        files: new Map([[file, [""]]]),
      });
    } finally {
      revertGlobals();
    }
  });

  tests.add("`extractFiles` with a `Blob` instance.", () => {
    class Blob {}

    const revertGlobals = revertableGlobals({ Blob });

    try {
      const file = new Blob();

      deepStrictEqual(extractFiles(file, isExtractableFile), {
        clone: null,
        files: new Map([[file, [""]]]),
      });
    } finally {
      revertGlobals();
    }
  });

  tests.add("`extractFiles` with a `ReactNativeFile` instance.", () => {
    const file = new ReactNativeFile({ uri: "", name: "", type: "" });

    deepStrictEqual(extractFiles(file, isExtractableFile), {
      clone: null,
      files: new Map([[file, [""]]]),
    });
  });

  tests.add("`extractFiles` with an object containing multiple files.", () => {
    const fileA = new ReactNativeFile({ uri: "", name: "", type: "" });
    const fileB = new ReactNativeFile({ uri: "", name: "", type: "" });

    deepStrictEqual(
      extractFiles(Object.freeze({ a: fileA, b: fileB }), isExtractableFile),
      {
        clone: { a: null, b: null },
        files: new Map([
          [fileA, ["a"]],
          [fileB, ["b"]],
        ]),
      }
    );
  });

  tests.add("`extractFiles` with an array containing multiple files.", () => {
    const file0 = new ReactNativeFile({ uri: "", name: "", type: "" });
    const file1 = new ReactNativeFile({ uri: "", name: "", type: "" });

    deepStrictEqual(
      extractFiles(Object.freeze([file0, file1]), isExtractableFile),
      {
        clone: [null, null],
        files: new Map([
          [file0, ["0"]],
          [file1, ["1"]],
        ]),
      }
    );
  });

  tests.add("`extractFiles` with a nested object containing a file.", () => {
    const file = new ReactNativeFile({ uri: "", name: "", type: "" });

    deepStrictEqual(
      extractFiles(
        Object.freeze({ a: Object.freeze({ a: file }) }),
        isExtractableFile
      ),
      {
        clone: { a: { a: null } },
        files: new Map([[file, ["a.a"]]]),
      }
    );
  });

  tests.add("`extractFiles` with a nested array containing a file.", () => {
    const file = new ReactNativeFile({ uri: "", name: "", type: "" });

    deepStrictEqual(
      extractFiles(Object.freeze([Object.freeze([file])]), isExtractableFile),
      {
        clone: [[null]],
        files: new Map([[file, ["0.0"]]]),
      }
    );
  });

  tests.add(
    "`extractFiles` with an object containing multiple references of a file.",
    () => {
      const file = new ReactNativeFile({ uri: "", name: "", type: "" });

      deepStrictEqual(
        extractFiles(Object.freeze({ a: file, b: file }), isExtractableFile),
        {
          clone: { a: null, b: null },
          files: new Map([[file, ["a", "b"]]]),
        }
      );
    }
  );

  tests.add(
    "`extractFiles` with an array containing multiple references of a file.",
    () => {
      const file = new ReactNativeFile({ uri: "", name: "", type: "" });

      deepStrictEqual(
        extractFiles(Object.freeze([file, file]), isExtractableFile),
        {
          clone: [null, null],
          files: new Map([[file, ["0", "1"]]]),
        }
      );
    }
  );

  tests.add("`extractFiles` with an object referenced multiple times.", () => {
    const file = new ReactNativeFile({ uri: "", name: "", type: "" });
    const inputA = Object.freeze({ a: file });
    const extraction = extractFiles(
      Object.freeze({ a: inputA, b: inputA }),
      isExtractableFile
    );
    const expectedRepeatedObject = { a: null };

    deepStrictEqual(extraction, {
      clone: { a: expectedRepeatedObject, b: expectedRepeatedObject },
      files: new Map([[file, ["a.a", "b.a"]]]),
    });
    strictEqual(extraction.clone.a, extraction.clone.b);
  });

  tests.add("`extractFiles` with an array referenced multiple times.", () => {
    const file = new ReactNativeFile({ uri: "", name: "", type: "" });
    const array = Object.freeze([file]);
    const extraction = extractFiles(
      Object.freeze({ a: array, b: array }),
      isExtractableFile
    );
    const expectedRepeatedArray = [null];

    deepStrictEqual(extraction, {
      clone: {
        a: expectedRepeatedArray,
        b: expectedRepeatedArray,
      },
      files: new Map([[file, ["a.0", "b.0"]]]),
    });
    strictEqual(extraction.clone.a, extraction.clone.b);
  });

  tests.add("`extractFiles` with an object with circular references.", () => {
    const file = new ReactNativeFile({ uri: "", name: "", type: "" });

    /** @type {Record<string, any>} */
    const input = { a: file };

    input.b = input;

    Object.freeze(input);

    /** @type {Record<string, any>} */
    const clone = { a: null };

    clone.b = clone;

    deepStrictEqual(extractFiles(input, isExtractableFile), {
      clone,
      files: new Map([[file, ["a"]]]),
    });
  });

  tests.add("`extractFiles` with an array with circular references.", () => {
    const file = new ReactNativeFile({ uri: "", name: "", type: "" });

    /** @type {Array<any>} */
    const input = [file];

    input[1] = input;

    Object.freeze(input);

    /** @type {Array<any>} */
    const clone = [null];

    clone[1] = clone;

    deepStrictEqual(extractFiles(input, isExtractableFile), {
      clone,
      files: new Map([[file, ["0"]]]),
    });
  });

  tests.add("`extractFiles` with an object with a `Symbol` key.", () => {
    const symbol = Symbol();
    const withoutSymbol = { b: 2 };

    deepStrictEqual(
      extractFiles(
        Object.freeze({
          [symbol]: 1,
          ...withoutSymbol,
        }),
        isExtractableFile
      ),
      {
        clone: withoutSymbol,
        files: new Map(),
      }
    );
  });
};
