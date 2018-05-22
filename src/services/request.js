import Config from "../config/index";
import { message } from 'antd';

const getToken = () => {
  let loginInfo = localStorage.getItem("login_info");
  let token = "";
  if(loginInfo){
    let a = JSON.parse(loginInfo);
    // console.log("去获取token信息",a);
    token = a.token.token;
  }
  return token;
};

const encodeURLBody = (params) => {
  const encodedParams = Object.keys(params).map(key => (
    `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  )).join('&');
  return encodedParams;
};

//设置请求的超时时间
function timeoutFetch(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      message.error('请求超时');
      reject("fetch time out");
    }, ms);
    //成功
    promise.then(
      (res) => {
        clearTimeout(timer);
        resolve(res);
      },
      //失败
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  })
}

function filterStatus(res) {
  if (res.ok) {
    return res;
  } else if(res.status == 403){
    message.error('无操作权限');
    return res;
  }else{
    throw new Error('server handle error');
    return {err_code: 502};
  }
}

function toLoginPage(){
  let a = window.location.origin + window.location.pathname;
  window.location = a + "#/login";
}

//如果未登录,跳转到登录页面
function filterJSON(res) {
  res = JSON.parse(res);
  // console.log("filterJSON拿到的结果",res);
  if(res.errors){
    if(res.errors[0].message.indexOf("Token无效") > -1){
      console.log("token无效啦");
      localStorage.removeItem(Config.loginInfoKey);
      toLoginPage();
      return false;
    }
  }
  return res;
}

const timeout = 15000;

const request = (params) => {

    //console.log('>>>>>>params', params);

    let netType = Config.netType.getInstance();
    let name = netType.getName();
    let uri = Config.apiDomain[name];

    console.log("**********当前的公链网络是", name);

    let headers = {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    let fetchOption = {
      method:'POST',
      headers:headers,
      body: JSON.stringify(params)
    };

    //debugger;
    // 模拟数据
    if(typeof params.interface_name !== 'undefined'){

    }else if(params.indexOf('rap2api')>-1  || params.indexOf('http') > -1){
      uri = params;
      headers = {
        Accept: 'application/json',
      };
      fetchOption = {
        method:'GET',
        headers:headers,
      };
    }

    return timeoutFetch(fetch(uri, fetchOption), timeout)
      .then(filterStatus)
      .then((response) => response.text())
      .then(filterJSON)
      .catch((e) => {
         if(e !== "fetch time out"){
           message.error("服务或者网络异常");
         }
        if (e instanceof Array) {
          e.forEach(console.log);
        } else {
          console.log('服务或者网络异常: ',e);
        }
        return false;
      });

};

export default {
  exec:request
};
