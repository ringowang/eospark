import React,{Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import * as tool from '../../utils/tool';
import { Tabs,Spin } from 'antd';
import MyTable from '../../components/MyTable';
import jQuery from 'jquery';
import styles from './css/Block.css';
import NotFound from '../../components/NotFound';
import ActionItem from '../../components/ActionItem';
const TabPane = Tabs.TabPane;

class Block extends Component{
    constructor(props){
      super(props);
      this.state = {
        detail: {},
        dataSource: [],
        loading: true,
        count: 0,
      };
      this.domLoadFlag = false;
      this.mypre = null;
      this.columns = [{
          title: '交易',
          dataIndex: 'id',
          key: 'id',
          render: (text,record,index) => {
            let action_info = record.action_info;
            return (<div>
              <div className={styles.tradeTbData}>
                <div className={styles.normalText}>交易ID: <a href="javascript:void(0);" onClick={()=>{this.toTradePage(text)}}>{text}</a></div>
                <div>{record.timestamp}</div>
              </div>
              {
                action_info.map((item,index)=>{
                  return ActionItem(item,index);
                })
              }
            </div>);
          }
      }];
    }

    toTradePage = (id)=>{
      this.props.dispatch(routerRedux.push(tool.getUri('/tx/'+id)));
    };

    renderActionItem = (data,index)=>{
      console.log('>>>>>>>', data);
      if(data){
        return (<div key={index}>
          <div style={{display:'flex'}}>
            <div style={{flex:1}}>发起人：{data.authorization[0].actor}@{data.authorization[0].permission}</div>
            <div style={{flex:1}}>合约: {data.account}</div>
            <div style={{flex:1}}>接口: {data.name}</div>
            <div style={{flex:1}}>参数: {data.data}</div>
          </div>
        </div>);
      }else{
        return <div></div>;
      }
    };

    componentWillReceiveProps(nextProps){
      console.log('》》》props变化', nextProps);
      if(this.props.match.params.id != nextProps.match.params.id){
        console.log('重新请求');
        this.init(nextProps.match.params.id);
      }
    }

    init = (id)=>{
      this.props.dispatch({
        type: 'eos/getBlockDetail',
        params:{
          block_num: parseInt(id),
        },
        callback: (data)=>{
          this.setState({
            loading: false,
          });
          if(data.raw_data){
            console.log('》》》》》已经加载');
            let s = data.raw_data;
            s = s.replace(/\r\n/g,"");
            s = s.replace(/\n/g,"");
            jQuery(this.mypre).html(this.syntaxHighlight(JSON.parse(s)));
          }
          this.setState({
            detail: data
          });
        },
        errCallback: ()=>{
          this.setState({
            loading: false,
          });
        }
      });
    };

    componentDidMount(){
    }

    componentWillMount(){
      this.init(this.props.match.params.id);
    }

   getBlockTrade = (page_num,page_size)=>{
     this.props.dispatch({
       type: 'eos/getBlockTrade',
       params:{
         block_num: parseInt(this.props.match.params.id),
         page_num: page_num,
         page_size: page_size,
       },
       callback: (data)=>{
         data.transaction_info.map((item,index)=>{
           item.key = index;
         });
         this.setState({
           dataSource: data.transaction_info,
           count: data.total
         })
       }
     });
   };

  syntaxHighlight = (json) => {
    if (typeof json != 'string') {
      json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
      var cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
  };


  toBlockProducerPage = (id)=>{
    this.props.dispatch(routerRedux.push(tool.getUri('/bp/'+id)));
  };


  render(){
    return this.renderDetail();
    let {detail,loading} = this.state;
    if(loading){
      return (
        <div className={styles.spinWrapper}>
          <Spin />
        </div>
      );
    } else if(detail.block_num){
      return this.renderDetail();
    }else{
      return this.renderNotFound();
    }
  }

  renderNotFound = ()=>{
    return (
      <NotFound/>
    );
  };

  toBlockPage = (id)=>{
    let s = tool.getUri('/block/'+id);
    window.location = window.location.origin + s;
  };

  renderDetail = ()=>{
      let {detail,dataSource} = this.state;
      let tab1 = `交易(${this.state.count})`;
      return (
        <div>
          <div className={styles.bread}>
            首页 / 区块#{detail.block_num}
          </div>
          <div className={styles.basic}>
            <div className={styles.title}>区块#{detail.block_num}</div>

            <div className={styles.line}>
              <div className={styles.left}>出块时间：{detail.timestamp}</div>
              <div className={styles.right}>Hash: {detail.id}</div>
            </div>
            <div className={styles.line}>
              <div className={styles.left}>出块节点：<a href="javascript:void(0);" onClick={()=>{this.toBlockProducerPage(detail.producer)}}>{detail.producer}</a></div>
              <div className={styles.right}>transaction_mroot：{detail.transaction_mroot}</div>
            </div>
            <div className={styles.line}>
              <div className={styles.left}>前一个区块：<a href="javascript:void(0)" onClick={()=>this.toBlockPage(detail.block_num-1)}>#{detail.block_num-1}</a></div>
              <div className={styles.right}>出块节点签名：{detail.producer_signature}</div>
            </div>
            <div className={styles.line}>
              <div className={styles.left}>后一个区块：<a href="javascript:void(0)" onClick={()=>this.toBlockPage(detail.block_num+1)}>#{detail.block_num+1}</a></div>
            </div>
          </div>

          <div className={styles.detail}>
            <Tabs defaultActiveKey="1" onChange={()=>{}}>
              <TabPane tab={tab1} key="1">
                <MyTable
                  showHeader={false}
                  dataSource={dataSource}
                  columns={this.columns}
                  count={this.state.count}
                  getTableData={this.getBlockTrade}
                />
              </TabPane>
              <TabPane tab="RAW数据" key="2" forceRender={true}>
                <pre ref={(r) => { this.mypre = r; }} >
                </pre>
              </TabPane>
            </Tabs>
          </div>
        </div>
      );
    }
}


export default connect()(Block);