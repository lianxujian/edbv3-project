var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ENV_CONFIG: '"dev"',
  BASE_API: '"/api/"',
  FILE_API:'"www.edbv3.com"'
})
