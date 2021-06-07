import TestDirector from 'test-director';
import test_bundle from './bundle.test.mjs';
import test_ReactNativeFile from './public/ReactNativeFile.test.mjs';
import test_extractFiles from './public/extractFiles.test.mjs';
import test_isExtractableFile from './public/isExtractableFile.test.mjs';

const tests = new TestDirector();

test_ReactNativeFile(tests);
test_extractFiles(tests);
test_isExtractableFile(tests);
test_bundle(tests);

tests.run();
