'use strict';

const { TestDirector } = require('test-director');

const tests = new TestDirector();

require('./public/ReactNativeFile.test')(tests);
require('./public/extractFiles.test')(tests);
require('./public/isExtractableFile.test')(tests);

tests.run();
