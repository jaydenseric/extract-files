'use strict';

const { TestDirector } = require('test-director');

const tests = new TestDirector();

require('./public/ReactNativeFile.test.js')(tests);
require('./public/extractFiles.test.js')(tests);
require('./public/isExtractableFile.test.js')(tests);

tests.run();
