let HOST = process.argv.splice(2)[0] || 'prod';
// let domainName = HOST=='test'?'www.edbv3.com':'uat.edb02.net';
let domainName = '';
switch (HOST) {
  case 'edbv3':
    domainName = 'www.edbv3.com';
    break;
  case 'uat':
    domainName = 'pre2.edb02.net';
    break;
  case 'baojie':
    domainName = 'oms.ys-yj.com';
    break;
  case 'edb':
    domainName = 'www.edb02.net';
    break;
}
module.exports = {
  NODE_ENV: '"production"',
  FILE_API:`"${domainName}"`,
  API_HOST:`"http://${domainName}/spider-api-web/api/"`,
  API_URL:`"http://${domainName}/"`,
};
