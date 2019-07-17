let HOST = process.argv.splice(2)[0] || 'prod';
// let domainName = HOST=='test'?'www.edbv3.com':'uat.edb02.net';//www.edb07.com.cn
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
console.log(domainName);
module.exports = {
  NODE_ENV: '"production"',
  FILE_API:`"${domainName}"`,
  BASE_API:`"http://${domainName}/spider-api-web/api/"`,
}
