/*
'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"'
})
*/

module.exports = {
  NODE_ENV: '"development"',
  ENV_CONFIG: '"dev"',
  API_URL:'""',
  API_HOST: "/api/",
  //APP_ORIGIN: '"http://192.168.60.8:8501/spider-api-web/api/"'   //建文
  APP_ORIGIN: '"http://www.edbv3.com/spider-api-web/api/"'  //131
}
