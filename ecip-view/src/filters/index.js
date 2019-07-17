/**
 * Created by chenyin on 2018/4/24.
 */
//格式化为两位数
export function toDouble(val) {
  return val < 10 ? '0' + val : '' + val
}

//格式化为两位数
export function toThree(val) {
  if(val != 0) {
    return val.toFixed(3)
  }else {
    return 0
  }
}

/**
 * 格式化日期时间
 * @param time
 * @param n  n=6为年月日时分秒，n=3为时分秒
 * @returns {string}
 */
export function normalTime(time,n) {
  if (time) {
    const oDate = new Date(time);
    const Y = oDate.getFullYear(),
      M = oDate.getMonth() + 1,
      D = oDate.getDate(),
      h = oDate.getHours(),
      mm = oDate.getMinutes(),
      s = oDate.getSeconds();

    if(n == 6) {
      return Y + '-' + toDouble(M) + '-' + toDouble(D) + ' ' + toDouble(h) + ':' + toDouble(mm) + ':' + toDouble(s);
    }else {
      return toDouble(h) + ':' + toDouble(mm) + ':' + toDouble(s);
    }


  }
}

// 格式化0-9
export function turnSingle(num) {
  return num < 10 ? '0' + num : num
}

function turnSingle(num) {
  return num < 10 ? '0' + num : num
}

// 时间戳转成年月日 时分秒
export function turnTimestamp(time) {
  var a = new Date(new Date(time));
  return a.getFullYear() + '-' + turnSingle(a.getMonth() + 1) + '-' + turnSingle(a.getDate()) + ' ' + turnSingle(a.getHours()) + ':' + turnSingle(a.getMinutes()) + ':' + turnSingle(a.getSeconds());
}

// 年月日 时分秒 转成时间戳
export function returnTimesStamp(time) {
  return Date.parse(new Date(time));
}

// 时间戳转成年月日
export function turnTimestamp2(time) {
  var a = new Date(new Date(time));
  return a.getFullYear() + '-' + (a.getMonth() + 1) + '-' + a.getDate();
}

// 补零的方法
export function returnFloat(x) {
  var f = parseFloat(x);
  var f = Math.round(x * 100) / 100;
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

export function returnOneFloat(value) {
  var value = Math.round(parseFloat(value) * 100) / 100;

  var xsd = value.toString().split(".");

  if (xsd.length == 1) {
    value = value.toString() + ".0";
    return value;
  }
  if (xsd.length > 1) {
    value = value.toString().substring(0, value.toString().indexOf(".") + 2);
    return value;
  }
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
  return y + '' + m;
}

export function addmulMonth(dtstr, n) {
  var s = dtstr.split("-");
  var yy = parseInt(s[0]);
  var mm = parseInt(s[1]) - 1;
  var dd = parseInt(s[2]);
  var dt = new Date(yy, mm, dd);
  dt.setMonth(dt.getMonth() + n);
  var month = parseInt(dt.getMonth()) + 1;
  return dt.getFullYear() + "-" + month + "-" + dd;
}

// 价格校验规则
export function priceValidator(x) {
  if (isNaN(x) || x + '' == '' || x == undefined) {
    return '';
  }
  if (x < 0) {
    return '';
  }
  x += '';
  if (x.indexOf('.') == -1) {
    return x;
  }
  var f = parseFloat(x);
  //var f = Math.floor(x*100)/100;
  var f = Number(x.toString().match(/^\d+(?:\.\d{0,2})?/));
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

//保留四位数字
export function keepFourBits(x) {
  if (isNaN(x) || x + '' == '' || x == undefined) {
    return '';
  }
  if (x <= 0) {
    return '';
  }
  x += '';
  if (x.indexOf('.') == -1) {
    return x;
  }
  var f = parseFloat(x);
  //var f = Math.floor(x*100)/100;
  var f = Number(x.toString().match(/^\d+(?:\.\d{0,4})?/));
  var s = f.toString();
  var rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 4) {
    s += '0';
  }
  return s;
}

//正整数校验
export function positiveIntegerValidator(x) {
  if (isNaN(x) || x + '' == '' || x == undefined) {
    return '';
  }
  if (x < 0) {
    return '';
  }
  x += '';
  if (x.indexOf('.') == -1) {
    return x;
  } else {
    return '';
    //x.slice(0,x.indexOf('.'))
  }

}

//去空格
export function Trim(str, is_global) {
  var result;
  result = str.replace(/(^\s+)|(\s+$)/g, "");
  if (is_global.toLowerCase() == "g") {
    result = result.replace(/\s/g, "");
  }
  return result;
}

/* 特殊字符*/
export function validateSpelCharacter(textval) {
  const reg = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
  return reg.test(textval)
}
