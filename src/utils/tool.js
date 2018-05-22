import moment from "moment";
import Config from '../config/index';

const formatTime = (time)=>{
  //0001-01-01 00:00:00 +0000 UTC
  if(time == "0001-01-01 00:00:00 +0000 UTC" || time == ""){
    return "";
  }

  let rs = "";
  if(time.indexOf("UTC") > 0){
    //2017-11-16 09:34:28 +0000 UTC
    rs = time.replace("+0000","");
    rs = rs.replace("UTC","");
    rs = rs.trim("");

  }else{
    // 2017-11-06 09:56:43 +0800 CST
    rs = time.replace("+0800","");
    rs = rs.replace("CST","");
    rs = rs.trim("");
  }
  return moment(rs).format("YY-MM-DD HH:mm:ss");
};

const formatFromTimestamp = (time) => {
  return moment(time).format('YY-MM-DD HH:mm');  
}

const getLoginInfo = ()=>{
  let logInfo = localStorage.getItem("login_info");
  if(logInfo){
    return JSON.parse(logInfo);
  }
  return null;
};

const isLogined = ()=>{
  let logInfo = getLoginInfo();
  if(logInfo && logInfo.basic && logInfo.basic.id){
    return true;
  }
  return false;
};

 const parseQueryString = (url) => {
  var obj = {}
  var keyvalue = []
  var key = '',
    value = ''
  var paraString = url.substring(url.indexOf('?') + 1, url.length).split('&')
  for (var i in paraString) {
    keyvalue = paraString[i].split('=')
    key = keyvalue[0]
    value = keyvalue[1]
    obj[key] = value
  }
  return obj
}


var toString = Object.prototype.toString;

function isFunction(obj) {
  return toString.call(obj) === '[object Function]'
}

function eq(a, b, aStack, bStack) {

  // === 结果为 true 的区别出 +0 和 -0
  if (a === b) return a !== 0 || 1 / a === 1 / b;

  // typeof null 的结果为 object ，这里做判断，是为了让有 null 的情况尽早退出函数
  if (a == null || b == null) return false;

  // 判断 NaN
  if (a !== a) return b !== b;

  // 判断参数 a 类型，如果是基本类型，在这里可以直接返回 false
  var type = typeof a;
  if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;

  // 更复杂的对象使用 deepEq 函数进行深度比较
  return deepEq(a, b, aStack, bStack);
};

function deepEq(a, b, aStack, bStack) {

  // a 和 b 的内部属性 [[class]] 相同时 返回 true
  var className = toString.call(a);
  if (className !== toString.call(b)) return false;

  switch (className) {
    case '[object RegExp]':
    case '[object String]':
      return '' + a === '' + b;
    case '[object Number]':
      if (+a !== +a) return +b !== +b;
      return +a === 0 ? 1 / +a === 1 / b : +a === +b;
    case '[object Date]':
    case '[object Boolean]':
      return +a === +b;
  }

  var areArrays = className === '[object Array]';
  // 不是数组
  if (!areArrays) {
    // 过滤掉两个函数的情况
    if (typeof a != 'object' || typeof b != 'object') return false;

    var aCtor = a.constructor,
      bCtor = b.constructor;
    // aCtor 和 bCtor 必须都存在并且都不是 Object 构造函数的情况下，aCtor 不等于 bCtor， 那这两个对象就真的不相等啦
    if (aCtor !== bCtor && !(isFunction(aCtor) && aCtor instanceof aCtor && isFunction(bCtor) && bCtor instanceof bCtor) && ('constructor' in a && 'constructor' in b)) {
      return false;
    }
  }


  aStack = aStack || [];
  bStack = bStack || [];
  var length = aStack.length;

  // 检查是否有循环引用的部分
  while (length--) {
    if (aStack[length] === a) {
      return bStack[length] === b;
    }
  }

  aStack.push(a);
  bStack.push(b);

  // 数组判断
  if (areArrays) {

    length = a.length;
    if (length !== b.length) return false;

    while (length--) {
      if (!eq(a[length], b[length], aStack, bStack)) return false;
    }
  }
  // 对象判断
  else {

    var keys = Object.keys(a),
      key;
    length = keys.length;

    if (Object.keys(b).length !== length) return false;
    while (length--) {

      key = keys[length];
      if (!(b.hasOwnProperty(key) && eq(a[key], b[key], aStack, bStack))) return false;
    }
  }

  aStack.pop();
  bStack.pop();
  return true;
}

function formatNumber(n){
  if(typeof n === 'undefined'){
    return '';
  }
  let a = parseFloat(n);
  if(isNaN(a)){
    return '';
  }else{
    return a.toLocaleString();
  }
}

const getUri = (uri) => {
    let o = Config.netType.getInstance();
    uri = '/' + o.getName() + uri;
    return uri;
};

export {
  formatTime,
  formatFromTimestamp,
  getLoginInfo,
  isLogined,
  parseQueryString,
  eq,
  formatNumber,
  getUri,
}
