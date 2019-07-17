/* 验证方法 樊虎 */
//套装拆分剩余重组套装
export function switchGroup(arr,eachArr,minusArr,n){
  var flag=true;
  if(n==0){
    var remainArr=[];
    for(var i=0;i<arr.length;i++){
      remainArr.push(arr[i]-minusArr[i]);
    }
  }else{
    remainArr=minusArr;
  }
  for(var j=0;j<eachArr.length;j++){
    if(remainArr[j]-eachArr[j]<0){
      flag=false;
    }
  }
  if(flag){
    var newMinusArr=[];
    for(var j=0;j<eachArr.length;j++){
      newMinusArr.push(remainArr[j]-eachArr[j]);
    }
    n++;
    return switchGroup(arr,eachArr,newMinusArr,n)
  }else{
    return [n,remainArr];
  }

}
//ag-grid
export function gridOptions(){
  return {
    enableColResize: true,
    //阻止单击行选中本行
    suppressRowClickSelection: true,
    headerCheckboxSelectionFilteredOnly:true,
    localeText: {
      noRowsToShow: ' ',
      pinColumn: "固定列",
      pinLeft: '居左',
      pinRight: '居右',
      noPin: '默认',
      autosizeThiscolumn: '自适应当前列',
      autosizeAllColumns: '自适应所有列',
      resetColumns: '重置列',
      toolPanel: '工具板',
      blanks: '空白',
      selectAll: '全选',
      searchOoo: '搜索',
      filterOoo: '筛选',
      columns: '自定义设置',
      groups: '行组',
      rowGroupColumnsEmptyMessage: '拖动此处以设置行组'
    }
  }
}
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

// 格式化0-9
export function turnSingle(num) {
  return num < 10 ? '0' + num : num
}

function turnSingle(num) {
  if((num+'').length==1 && num<10){
    return '0'+num;
  }else{
    return num;
  }
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
  return a.getFullYear() + '-' + turnSingle(a.getMonth() + 1) + '-' + turnSingle(a.getDate());
}

//2018-6-26 23:59:59转成20180626235959格式
export function turnTimestamp3(time) {
  var timeArr1=time.split(' ')[0].split('-'),timeArr2=time.split(' ')[1].split(':');
  return turnSingle(timeArr1[0])+turnSingle(timeArr1[1])+turnSingle(timeArr1[2])+turnSingle(timeArr2[0])+turnSingle(timeArr2[1])+turnSingle(timeArr2[2]);
}

//20180626235959转成2018-6-26 23:59:59格式
export function turnTimestamp4(time) {
  time+='';
  return time.slice(0,4)+'-'+time.slice(4,6)+'-'+time.slice(6,8)+' '+time.slice(8,10)+':'+time.slice(10,12)+':'+time.slice(12,14)
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

//补零的方法（一个零）
export function returnOneFloat(value) {
  if(isNaN(value) || value+''=='' || value==undefined || value<0){
    return '';
  }
  value += '';
  if (value.indexOf('.') == -1) {
    return value;
  }
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

// 补零的方法（两个零）
export function returnFloat(x) {
  if(isNaN(x) || x+''=='' || x==undefined || x<0){
    return '';
  }
  x += '';
  if (x.indexOf('.') == -1) {
    return x;
  }
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

// 价格校验规则(保留两位小数)
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

//正整数校验不能为零
export function positiveIntegerValidator(x) {
  if (isNaN(x) || x + '' == '' || x == undefined) {
    return '';
  }
  if (x <= 0) {
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

//正整数校验或零
export function positiveIntegerZero(x) {
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

export var version = '9.9.9'

/* 特殊字符*/
export function validateSpelCharacter(textval) {
  const reg = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
  return reg.test(textval)
}

/* 集合里根据id添加label*/
export function selShowLabel(parentArr, arr, label, id ,type) {
  if (type!=2) {
    var mapArr = new Map();
    arr.forEach((item, i) => {
      mapArr.set(item[id], item[label])
    })
    parentArr.forEach((item, i) => {
      if (mapArr.get(item[id])) {
        item[label] = mapArr.get(item[id]);
      } else {
        item[label] = '';
      }
    })
  } else {
    parentArr = parentArr.map(v => {
      var _listPlat = [], mapArr = new Map();
      v[id].forEach((item, i) => {
        mapArr.set(item, item);
      })
      arr.forEach((item, i) => {
        if (mapArr.get(item[id])) {
          _listPlat.push(item[label]);
        }
      })
      v[label] = _listPlat
      return v
    })
  }
return parentArr;
}

/**
 * Created by jiachenpan on 16/11/18.
 */

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

// 格式化时间
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 *get getByteLen
 * @param {Sting} val input value
 * @returns {number} output value
 */
export function getByteLen(val) {
  let len = 0
  for (let i = 0; i < val.length; i++) {
    if (val[i].match(/[^\x00-\xff]/ig) != null) {
      len += 1
    } else {
      len += 0.5
    }
  }
  return Math.floor(len)
}

export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

export function param(json) {
  if (!json) return ''
  return cleanArray(Object.keys(json).map(key => {
    if (json[key] === undefined) return ''
    return encodeURIComponent(key) + '=' +
      encodeURIComponent(json[key])
  })).join('&')
}

export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
}

export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

export function objectMerge(target, source) {
  /* Merges two  objects,
     giving the last one precedence */

  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  for (const property in source) {
    if (source.hasOwnProperty(property)) {
      const sourceProperty = source[property]
      if (typeof sourceProperty === 'object') {
        target[property] = objectMerge(target[property], sourceProperty)
        continue
      }
      target[property] = sourceProperty
    }
  }
  return target
}

export function scrollTo(element, to, duration) {
  if (duration <= 0) return
  const difference = to - element.scrollTop
  const perTick = difference / duration * 10
  setTimeout(() => {
    console.log(new Date())
    element.scrollTop = element.scrollTop + perTick
    if (element.scrollTop === to) return
    scrollTo(element, to, duration - 10)
  }, 10)
}

export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

export const pickerOptions = [
  {
    text: '今天',
    onClick(picker) {
      const end = new Date()
      const start = new Date(new Date().toDateString())
      end.setTime(start.getTime())
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一周',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(end.getTime() - 3600 * 1000 * 24 * 7)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一个月',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近三个月',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      picker.$emit('pick', [start, end])
    }
  }]

export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  for (const keys in source) {
    if (source.hasOwnProperty(keys)) {
      if (source[keys] && typeof source[keys] === 'object') {
        targetObj[keys] = source[keys].constructor === Array ? [] : {}
        targetObj[keys] = deepClone(source[keys])
      } else {
        targetObj[keys] = source[keys]
      }
    }
  }
  return targetObj
}

// 方证：原项目中迁移过来的
export function isStrEmpty(obj) {
  if (typeof obj == 'undefined' || obj == null || obj == '') {
    return true;
  } else {
    return false;
  }
}

