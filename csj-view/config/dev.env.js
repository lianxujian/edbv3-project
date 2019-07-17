var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ENV_CONFIG: '"dev"',
  BASE_API: '"/api/"',
  OLD_API:'"/api/"',//'"/api/"'
  IMG_UPLOAD:'"csj.file"'
})
