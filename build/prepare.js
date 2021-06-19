const fs = require('fs-extra')
fs.emptyDirSync('./dist')
fs.copyFileSync('./build/index.js', './dist/index.js')
