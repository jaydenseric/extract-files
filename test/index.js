'use strict'

const { TestDirector } = require('test-director')

const tests = new TestDirector()

require('./lib/ReactNativeFile.test')(tests)
require('./lib/extractFiles.test')(tests)
require('./lib/isExtractableFile.test')(tests)

tests.run()
