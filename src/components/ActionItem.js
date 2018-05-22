let ActionItem = (data,index)=>{
  let creater = '';
  if(data.authorization.length > 0){
    creater = `${data.authorization[0].actor}@${data.authorization[0].permission}`;
  }
  if(data){
    return (<div key={index}>
      <div style={{display:'flex'}}>
        <div style={{flex:1}}>发起人：{creater}</div>
        <div style={{flex:1}}>合约: {data.account}</div>
        <div style={{flex:1}}>接口: {data.name}</div>
        <div style={{flex:1}}>参数: {data.data}</div>
      </div>
    </div>);
  }else{
    return <div></div>;
  }
};

export default ActionItem;