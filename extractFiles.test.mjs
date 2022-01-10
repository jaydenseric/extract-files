// @ts-check

import { deepStrictEqual, notStrictEqual, strictEqual } from "assert";
import revertableGlobals from "revertable-globals";
import ReactNativeFile from "./ReactNativeFile.mjs";
import extractFiles from "./extractFiles.mjs";
import assertBundleSize from "./test/assertBundleSize.mjs";

/**
 * Adds `extractFiles` tests.
 * @param {import("test-director").default} tests Test director.
 */
export default (tests) => {
  tests.add("`extractFiles` bundle size.", async () => {
    await assertBundleSize(new URL("./extractFiles.mjs", import.meta.url), 520);
  });

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
      deepStrictEqual(extractFiles(value), {
        clone: value,
        files: new Map(),
      });
    });

    tests.add(`${label} in an object, \`Object\` instance.`, () => {
      const object = Object.freeze({ a: value });
      const result = extractFiles(object);

      deepStrictEqual(result, {
        clone: object,
        files: new Map(),
      });
      notStrictEqual(result.clone, object);
    });

    tests.add(`${label} in an object, non \`Object\` instance.`, () => {
      const object = Object.freeze(
        Object.assign(Object.create(null), { a: value })
      );
      const result = extractFiles(object);

      deepStrictEqual(result, {
        clone: object,
        files: new Map(),
      });
      notStrictEqual(result.clone, object);
    });

    tests.add(`${label} in an array.`, () => {
      const array = Object.freeze([value]);
      const result = extractFiles(array);

      deepStrictEqual(result, {
        clone: array,
        files: new Map(),
      });
      notStrictEqual(result.clone, array);
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

      deepStrictEqual(extractFiles(fileList), {
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

      deepStrictEqual(extractFiles(file), {
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

      deepStrictEqual(extractFiles(file), {
        clone: null,
        files: new Map([[file, [""]]]),
      });
    } finally {
      revertGlobals();
    }
  });

  tests.add("`extractFiles` with a `ReactNativeFile` instance.", () => {
    const file = new ReactNativeFile({ uri: "", name: "", type: "" });

    deepStrictEqual(extractFiles(file), {
      clone: null,
      files: new Map([[file, [""]]]),
    });
  });

  tests.add("`extractFiles` with an object containing multiple files.", () => {
    const fileA = new ReactNativeFile({ uri: "", name: "", type: "" });
    const fileB = new ReactNativeFile({ uri: "", name: "", type: "" });

    deepStrictEqual(extractFiles(Object.freeze({ a: fileA, b: fileB })), {
      clone: { a: null, b: null },
      files: new Map([
        [fileA, ["a"]],
        [fileB, ["b"]],
      ]),
    });
  });

  tests.add("`extractFiles` with an array containing multiple files.", () => {
    const file0 = new ReactNativeFile({ uri: "", name: "", type: "" });
    const file1 = new ReactNativeFile({ uri: "", name: "", type: "" });

    deepStrictEqual(extractFiles(Object.freeze([file0, file1])), {
      clone: [null, null],
      files: new Map([
        [file0, ["0"]],
        [file1, ["1"]],
      ]),
    });
  });

  tests.add("`extractFiles` with a nested object containing a file.", () => {
    const file = new ReactNativeFile({ uri: "", name: "", type: "" });

    deepStrictEqual(
      extractFiles(Object.freeze({ a: Object.freeze({ a: file }) })),
      {
        clone: { a: { a: null } },
        files: new Map([[file, ["a.a"]]]),
      }
    );
  });

  tests.add("`extractFiles` with a nested array containing a file.", () => {
    const file = new ReactNativeFile({ uri: "", name: "", type: "" });

    deepStrictEqual(extractFiles(Object.freeze([Object.freeze([file])])), {
      clone: [[null]],
      files: new Map([[file, ["0.0"]]]),
    });
  });

  tests.add(
    "`extractFiles` with an object containing multiple references of a file.",
    () => {
      const file = new ReactNativeFile({ uri: "", name: "", type: "" });

      deepStrictEqual(extractFiles(Object.freeze({ a: file, b: file })), {
        clone: { a: null, b: null },
        files: new Map([[file, ["a", "b"]]]),
      });
    }
  );

  tests.add(
    "`extractFiles` with an array containing multiple references of a file.",
    () => {
      const file = new ReactNativeFile({ uri: "", name: "", type: "" });

      deepStrictEqual(extractFiles(Object.freeze([file, file])), {
        clone: [null, null],
        files: new Map([[file, ["0", "1"]]]),
      });
    }
  );

  tests.add("`extractFiles` with an object referenced multiple times.", () => {
    const file = new ReactNativeFile({ uri: "", name: "", type: "" });
    const inputA = Object.freeze({ a: file });
    const result = extractFiles(Object.freeze({ a: inputA, b: inputA }));
    const expectedRepeatedObject = { a: null };

    deepStrictEqual(result, {
      clone: { a: expectedRepeatedObject, b: expectedRepeatedObject },
      files: new Map([[file, ["a.a", "b.a"]]]),
    });
    strictEqual(result.clone.a, result.clone.b);
  });

  tests.add("`extractFiles` with an array referenced multiple times.", () => {
    const file = new ReactNativeFile({ uri: "", name: "", type: "" });
    const array = Object.freeze([file]);
    const result = extractFiles(Object.freeze({ a: array, b: array }));
    const expectedRepeatedArray = [null];

    deepStrictEqual(result, {
      clone: {
        a: expectedRepeatedArray,
        b: expectedRepeatedArray,
      },
      files: new Map([[file, ["a.0", "b.0"]]]),
    });
    strictEqual(result.clone.a, result.clone.b);
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

    deepStrictEqual(extractFiles(input), {
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

    deepStrictEqual(extractFiles(input), {
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
        })
      ),
      {
        clone: withoutSymbol,
        files: new Map(),
      }
    );
  });

  tests.add("`extractFiles` with a second `path` parameter, file.", () => {
    const file = new ReactNativeFile({ uri: "", name: "", type: "" });

    deepStrictEqual(extractFiles(file, "prefix"), {
      clone: null,
      files: new Map([[file, ["prefix"]]]),
    });
  });

  tests.add(
    "`extractFiles` with a second `path` parameter, file nested in an object and array.",
    () => {
      const file = new ReactNativeFile({ uri: "", name: "", type: "" });

      deepStrictEqual(extractFiles({ a: [file] }, "prefix"), {
        clone: { a: [null] },
        files: new Map([[file, ["prefix.a.0"]]]),
      });
    }
  );

  tests.add(
    "`extractFiles` with a third `isExtractableFile` parameter.",
    () => {
      class CustomFile {}

      const file = new CustomFile();

      deepStrictEqual(
        extractFiles(file, "", (value) => value instanceof CustomFile),
        {
          clone: null,
          files: new Map([[file, [""]]]),
        }
      );
    }
  );
};
