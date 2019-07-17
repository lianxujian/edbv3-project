// 手机号验证
export function isValidPhone(str) {
  const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
  return reg.test(str)
}
// 邮箱的验证
export function isEmail(str) {
  const reg = /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/
  return reg.test(str)
}
//格式化0-9
export function turnSingle(num){
  return num<10?'0'+num:num;
}
//时间戳转成年月日 时分秒
export function turnTimestamp(time){
  var x=new Date(time).toLocaleDateString().replace(/\//g,'-');
  var h=this.turnSingle(new Date(time).getHours());
  var m=this.turnSingle(new Date(time).getMinutes());
  var s=this.turnSingle(new Date(time).getSeconds());
  return x+' '+h+':'+m+':'+s;
}
//时间戳转成年月日 时分秒
export function turnTimestamp2(time){
  var y=this.turnSingle(new Date(time).getFullYear());
  var o=this.turnSingle(new Date(time).getMonth()+1);
  var d=this.turnSingle(new Date(time).getDate());
  var h=this.turnSingle(new Date(time).getHours());
  var m=this.turnSingle(new Date(time).getMinutes());
  var s=this.turnSingle(new Date(time).getSeconds());
  return y+'-'+o+'-'+d+' '+h+':'+m+':'+s;
}
//补零的方法
export function returnFloat(x) {
  var f = parseFloat(x);
  f = Math.round(x*100)/100;
  var s = f.toString();
  var rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 2) {
    s += '0';
  }
  return s;
}

 // 格式化时间
export function formatDate(date) {
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  return y + '-' + m + '-' + d;
}

// 格式化时间
export function formatDate2(date) {
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  return y +''+ m;
}

export function addmulMonth(dtstr, n)
{
  var s = dtstr.split("-");
  var yy = parseInt(s[0]);
  var mm = parseInt(s[1])-1 ;
  var dd = parseInt(s[2]);
  var dt = new Date(yy, mm, dd);
  dt.setMonth(dt.getMonth() + n);
  var month = parseInt(dt.getMonth()) + 1;
  return dt.getFullYear() + "-" + month  + "-" + dd;
}
