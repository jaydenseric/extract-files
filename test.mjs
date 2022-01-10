// @ts-check

import TestDirector from "test-director";
import test_ReactNativeFile from "./ReactNativeFile.test.mjs";
import test_extractFiles from "./extractFiles.test.mjs";
import test_isExtractableFile from "./isExtractableFile.test.mjs";

const tests = new TestDirector();

test_ReactNativeFile(tests);
test_extractFiles(tests);
test_isExtractableFile(tests);

tests.run();
