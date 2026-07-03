const fs = require('fs')
const path = require('path')

// create a file to ensure mocks are initialized in dev
const target = path.join(__dirname, '..', 'src', 'lib', 'mock.ts')
if (!fs.existsSync(target)) {
  // nothing to do; mock file is committed
}
process.exit(0)
