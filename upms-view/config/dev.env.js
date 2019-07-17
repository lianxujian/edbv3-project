var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ENV_CONFIG: '"dev"',
  API_HOST: '"http://www.edbv3.com/spider-api-web/api/"',
  API_URL:'""',
  FILE_API:'"www.edbv3.com"'
})

