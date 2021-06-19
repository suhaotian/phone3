
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./phone3.cjs.production.min.js')
} else {
  module.exports = require('./phone3.cjs.development.js')
}
