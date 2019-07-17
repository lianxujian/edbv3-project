let HOST = process.argv.splice(2)[0] || 'prod';
// let domainName = HOST=='test'?'www.edbv3.com':'uat.edb02.net';
let domainName = '59.111.102.106:9091';
// switch (HOST) {
//   case 'edbv3':
//     domainName = 'www.edbv3.com';
//     break;
//   case 'uat':
//     domainName = 'uat.edb02.net';
//     break;
//   case 'baojie':
//     domainName = 'oms.ys-yj.com';
//     break;
//   case 'edb':
//     domainName = 'www.edb02.net';
//     break;
// }
module.exports = {
  NODE_ENV: '"production"',
  FILE_API:`"${domainName}"`,
  BASE_API:`"http://${domainName}"`,
};
