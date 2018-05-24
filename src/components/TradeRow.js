import styles from './css/TradeRow.css';
import {Icon} from 'antd';

let ActionItem = (data,index,isLast=false)=>{
  let creater = '';
  if(data.authorization.length > 0){
    creater = `${data.authorization[0].actor}@${data.authorization[0].permission}`;
  }
  let _style = {};
  if(index == 0){
    _style = {paddingTop:20};
  }
  if(data){
    return (<div key={index} className={styles.line} style={_style}>
      <div style={{overflow:'hidden'}}>
        <div style={{float:'left', width: 220}}>发起人：{creater}</div>
        <div style={{float:'left', width: 160}}>合约: {data.account}</div>
        <div style={{float:'left', width: 150}}>接口: {data.name}</div>
        <div className={styles.params} style={{float:'left', width: 760}}>
          <span>参数: {data.data}{data.data}</span>
        </div>
      </div>
      {
        isLast ? null : <div className={styles.division}></div>
      }
    </div>);
  }else{
    return <div></div>;
  }
};

let TradeRow = (record, clickFunc)=>{
  let data = record;
  console.log('>>>>>>>', data);

  if(data){
    let action_info = record.action_info;
    // 多个action测试
    // action_info = action_info.concat(action_info);
    let len = action_info.length;
    return (
      <div className={styles.rowContent}>
        <div className={styles.header}>
          <div>交易ID: <a href="javascript:void(0)" onClick={() => {clickFunc(data.id);}}>{data.id}</a></div>
          <div>{data.timestamp}</div>
        </div>
        <div>
          {
            action_info.map((item, index) => {
              return ActionItem(item, index, index===len-1);
            })
          }
        </div>
      </div>);
  }else{
    return <div></div>;
  }
};
export default TradeRow;