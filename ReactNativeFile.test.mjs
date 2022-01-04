import { strictEqual } from "assert";
import ReactNativeFile from "./ReactNativeFile.js";
import assertBundleSize from "./test/assertBundleSize.mjs";

export default (tests) => {
  tests.add("`ReactNativeFile` bundle size.", async () => {
    await assertBundleSize(
      new URL("./ReactNativeFile.js", import.meta.url),
      120
    );
  });

  tests.add("`ReactNativeFile` constructor.", () => {
    const uri = "<uri>";
    const name = "a.jpg";
    const type = "image/jpeg";
    const file = new ReactNativeFile({ uri, name, type });

    strictEqual(file.uri, uri);
    strictEqual(file.name, name);
    strictEqual(file.type, type);
  });
};
