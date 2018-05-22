const errCode =  {
  10026:"账号输入错误",
};

function getErrMsg(msg, defaultValue = "出错了"){
  const s = msg.split(":");
  let code = 0;
  if(s.length > 2){
    code = s[1];
  }
  if(errCode[code]){
    return errCode[code];
  }

  return defaultValue;
};

export {
  getErrMsg
};
