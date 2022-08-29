# extract-files

A function to recursively extract files and their object paths within a value, replacing them with `null` in a deep clone without mutating the original value. [`FileList`](https://developer.mozilla.org/en-US/docs/Web/API/Filelist) instances are treated as [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) instance arrays. Files are typically [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) and [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) instances.

Used by [GraphQL multipart request spec client implementations](https://github.com/jaydenseric/graphql-multipart-request-spec#implementations) such as [`graphql-react`](https://npm.im/graphql-react) and [`apollo-upload-client`](https://npm.im/apollo-upload-client).

## Installation

For [Node.js](https://nodejs.org), to install [`extract-files`](https://npm.im/extract-files) with [npm](https://npmjs.com/get-npm), run:

```sh
npm install extract-files
```

For [Deno](https://deno.land) and browsers, an example import map:

```json
{
  "imports": {
    "extract-files/": "https://unpkg.com/extract-files@13.0.0/",
    "is-plain-obj": "https://unpkg.com/is-plain-obj@4.1.0/index.js",
    "is-plain-obj/": "https://unpkg.com/is-plain-obj@4.1.0/"
  }
}
```

See the function [`extractFiles`](./extractFiles.mjs) to get started.

## Requirements

Supported runtime environments:

- [Node.js](https://nodejs.org) versions `^14.17.0 || ^16.0.0 || >= 18.0.0`.
- [Deno](https://deno.land), importing from a CDN that might require an import map for dependencies.
- Browsers matching the [Browserslist](https://browsersl.ist) query [`> 0.5%, not OperaMini all, not dead`](https://browsersl.ist/?q=%3E+0.5%25%2C+not+OperaMini+all%2C+not+dead).

Non [Deno](https://deno.land) projects must configure [TypeScript](https://typescriptlang.org) to use types from the ECMAScript modules that have a `// @ts-check` comment:

- [`compilerOptions.allowJs`](https://typescriptlang.org/tsconfig#allowJs) should be `true`.
- [`compilerOptions.maxNodeModuleJsDepth`](https://typescriptlang.org/tsconfig#maxNodeModuleJsDepth) should be reasonably large, e.g. `10`.
- [`compilerOptions.module`](https://typescriptlang.org/tsconfig#module) should be `"node16"` or `"nodenext"`.

## Exports

The [npm](https://npmjs.com) package [`extract-files`](https://npm.im/extract-files) features [optimal JavaScript module design](https://jaydenseric.com/blog/optimal-javascript-module-design). It doesn’t have a main index module, so use deep imports from the ECMAScript modules that are exported via the [`package.json`](./package.json) field [`exports`](https://nodejs.org/api/packages.html#exports):

- [`extractFiles.mjs`](./extractFiles.mjs)
- [`isExtractableFile.mjs`](./isExtractableFile.mjs)
