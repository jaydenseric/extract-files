// @ts-check

import TestDirector from "test-director";
import test_extractFiles from "./extractFiles.test.mjs";
import test_isExtractableFile from "./isExtractableFile.test.mjs";

const tests = new TestDirector();

test_extractFiles(tests);
test_isExtractableFile(tests);

tests.run();
