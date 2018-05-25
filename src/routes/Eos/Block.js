import React,{Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import * as tool from '../../utils/tool';
import { Tabs,Spin } from 'antd';
import MyTable from '../../components/MyTable';
import jQuery from 'jquery';
import styles from './css/Block.css';
import NotFound from '../../components/NotFound';
import TradeRow from '../../components/TradeRow';
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
          className:'myCol',
          dataIndex: 'id',
          key: 'id',
          render: (text,record,index) => {
            return TradeRow(record,()=>{this.toTradePage(text)});
          }
      }];
    }

    toTradePage = (id)=>{
      this.props.dispatch(routerRedux.push(tool.getUri('/tx/'+id)));
    };

    componentWillReceiveProps(nextProps){
      console.log('》》》props变化', nextProps);
      if(this.props.match.params.id != nextProps.match.params.id){
        console.log('重新请求');
        this.init(nextProps.match.params.id);
      }
    }

    init = (id)=>{
      let params = {};
      //hash值
      if(id.length == 64){
        params.block_hash = id;
      }else{
        params.block_num = parseInt(id);
      }
      this.props.dispatch({
        type: 'eos/getBlockDetail',
        params,
        callback: (data)=>{
          this.setState({
            loading: false,
            detail: data
          });
          if(data.raw_data){
            console.log('》》》》》已经加载');
            let s = data.raw_data;
            s = s.replace(/\r\n/g,"");
            s = s.replace(/\n/g,"");
            jQuery(this.mypre).html(this.syntaxHighlight(JSON.parse(s)));
          }
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
     let id = this.props.match.params.id;
     let params = {
       page_num: page_num,
       page_size: page_size,
     };
     //hash值
     if(id.length == 64){
       params.block_hash = id;
     }else{
       params.block_num = parseInt(id);
     }

     this.props.dispatch({
       type: 'eos/getBlockTrade',
       params,
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

  toIndex = ()=>{
    window.location = window.location.origin + tool.getUri('/');
  };

  renderDetail = ()=>{
      let {detail,dataSource} = this.state;
      let tab1 = `交易(${this.state.count})`;
      return (
        <div>
          <div className={styles.bread}>
            <a href="javascript:void(0)" style={{color:'rgba(0, 0, 0, 0.65)'}} onClick={this.toIndex}>首页</a> / 区块#{detail.block_num}
          </div>
          <div className={styles.basic}>
            <div className={styles.title}>区块#{detail.block_num}</div>

            <div style={{overflow:'hidden'}}>
              <div className={styles.leftWrapper}>
                <div className={styles.item}>
                  <div className={styles.itemLabel}>出块时间:</div>
                  <div className={styles.itemValue}>{detail.timestamp}</div>
                </div>
                <div className={styles.item}>
                  <div className={styles.itemLabel}>出块节点:</div>
                  <div className={styles.itemValue}><a href="javascript:void(0);" onClick={()=>{this.toBlockProducerPage(detail.producer)}}>{detail.producer}</a></div>
                </div>
                <div className={styles.item}>
                  <div className={styles.itemLabel}>前一个区块:</div>
                  <div className={styles.itemValue}><a href="javascript:void(0)" onClick={()=>this.toBlockPage(detail.block_num-1)}>#{detail.block_num-1}</a></div>
                </div>
                <div className={styles.item}>
                  <div className={styles.itemLabel}>后一个区块:</div>
                  <div className={styles.itemValue}><a href="javascript:void(0)" onClick={()=>this.toBlockPage(detail.block_num+1)}>#{detail.block_num+1}</a></div>
                </div>
              </div>
              <div className={styles.rightWrapper}>
                <div className={styles.item}>
                  <div className={styles.itemLabel2}>block_id:</div>
                  <div className={styles.itemValue2}>{detail.id}</div>
                </div>
                <div className={styles.item}>
                  <div className={styles.itemLabel2}>transaction_mroot:</div>
                  <div className={styles.itemValue2}>{detail.transaction_mroot}</div>
                </div>
                <div className={styles.item}>
                  <div className={styles.itemLabel2}>出块节点签名:</div>
                  <div className={styles.itemValue2}>{detail.producer_signature}</div>
                </div>
              </div>
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