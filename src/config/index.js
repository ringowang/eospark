var Singleton = function(){
  this.name = 'mainnet';
};

Singleton.prototype.getName = function(){
  return ( this.name );
};

Singleton.prototype.setName = function(name){
  console.log('公链网络要被修改了', name);
  this.name = name;
};

Singleton.getInstance = (function(){
  var instance = null;

  return function(){
    if ( !instance ){
      instance = new Singleton();
    }
    return instance;
  }
})();


export default{
  //正式站点
  apiDomain: {
    mainnet: 'http://47.75.132.47:9999/interface',
    testnet: 'http://47.75.132.47:9999/interface',
  },
  loginInfoKey:"login_info",
  noLoginErr: 1502,
  pathWithoutAuth: [
    "/login",
  ],
  netType: Singleton,
}
