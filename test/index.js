'use strict';

const { TestDirector } = require('test-director');

const tests = new TestDirector();

require('./lib/ReactNativeFile.test.js')(tests);
require('./lib/extractFiles.test.js')(tests);
require('./lib/isExtractableFile.test.js')(tests);

tests.run();
