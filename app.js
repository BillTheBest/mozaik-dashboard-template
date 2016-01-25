var path = require('path')
var minimatch = require('minimatch')

require('babel/register')({
  only: function(filename) {
    var p = path.relative(__dirname, filename)
    return [
      'node_modules/mozaik*/src/**/*',
      'node_modules/mozaik-ext-flowthings/**/*',
      'mozaik-ext-flowthings/**/*',
      'src/**/*'
    ].reduce(function(a, b) {
      return a || minimatch(p, b)
    }, false)
  }
})

var mozaik = new (require('mozaik'))(require('./config'))
mozaik.bus.registerApi('flowthings', require('mozaik-ext-flowthings/client'))
mozaik.startServer()
