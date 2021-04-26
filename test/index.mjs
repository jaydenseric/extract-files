import TestDirector from 'test-director';
import testBundle from './bundle.test.mjs';
import testReactNativeFile from './public/ReactNativeFile.test.mjs';
import testExtractFiles from './public/extractFiles.test.mjs';
import testIsExtractableFile from './public/isExtractableFile.test.mjs';

const tests = new TestDirector();

testReactNativeFile(tests);
testExtractFiles(tests);
testIsExtractableFile(tests);
testBundle(tests);

tests.run();
