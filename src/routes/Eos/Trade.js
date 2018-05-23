import React,{Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Tabs,Table,Spin } from 'antd';
import jQuery from 'jquery';
import NotFound from '../../components/NotFound';
import * as tool from '../../utils/tool';
import styles from './css/Block.css';
const TabPane = Tabs.TabPane;

class Trade extends Component{
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
      dataIndex: 'name',
      key: 'name',
      render: (text,record) => {return this.renderRow(record);},
    }];
  }

  renderRow = (record)=>{
     let data = record;
     console.log('>>>>>>>', data);
     if(data){
       return (<div>
         <div style={{display: 'flex'}}>
           <div style={{flex: 1}}>发起人：{data.actor}@{data.permission}</div>
           <div style={{flex: 1}}>合约: {data.account}</div>
           <div style={{flex: 1}}>接口: {data.name}</div>
           <div style={{flex: 1}}>参数: {data.data}</div>
         </div>
         <div style={{marginTop: 10, color: '#ccc'}}>hex_data {data.hex_data}</div>
       </div>);
     }else{
       return <div></div>;
     }
  };

  componentDidMount(){

  }

  componentWillReceiveProps(nextProps){
    console.log('》》》props变化', nextProps);
    if(this.props.match.params.id != nextProps.match.params.id){
      console.log('重新请求');
      this.init(nextProps.match.params.id);
    }
  }

  init = (id)=>{
    this.props.dispatch({
      type: 'eos/getTradeDetail',
      params:{
        id: id,
      },
      callback: (data)=>{
        this.setState({
          detail: data,
          loading: false,
        });
        if(data.raw_data){
          console.log('》》》》》已经加载', data.raw_data);
          let s = data.raw_data;
          jQuery(this.mypre).html(this.syntaxHighlight(JSON.parse(s)));
        }
      },
      errCallback:()=>{
        this.setState({
          detail: data,
          loading: false,
        })
      }
    });

    this.props.dispatch({
      type: 'eos/getTradeAction',
      params:{
        id: id,
        page_num: 1,
        page_size: 10,
      },
      callback: (data)=>{
        let dataSource = this.getDataSource(data.action_info);
        this.setState({
          dataSource: dataSource,
          count: dataSource.length,
        })
      }
    });
  };

  componentWillMount(){
     this.init(this.props.match.params.id);
  }

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

  getDataSource = (data)=>{
    let rs = [];
    for(let i in data){
      let item = data[i];
      item.authorization.map((d,index)=>{
        item.actor = item.actor;
        item.permission = item.permission;
        item.key = i;
        rs.push(item);
      });
    }
    return rs;
  };

  onPaginationChange = ()=>{

  };

  toBlockPage = (id)=>{
    this.props.dispatch(routerRedux.push(tool.getUri('/block/'+id)));
  };

  renderNotFound = ()=>{
    return (
      <NotFound/>
    );
  };

  render(){
    let {detail,loading} = this.state;
    if(loading){
      return (
        <div className={styles.spinWrapper}>
          <Spin />
        </div>
      );
    } else if(detail.id){
      return this.renderDetail();
    }else{
      return this.renderNotFound();
    }
  }

  renderDetail = () => {
    let {detail,dataSource} = this.state;
    let signatures = '';
    if(detail.signatures){
      if ((detail.signatures instanceof Array) && detail.signatures.length > 0) {
        signatures = detail.signatures.join(',');
      } else {
        signatures = detail.signatures;
      }
    }
    let tab1 = `actions(${this.state.count})`;
    return (
      <div>

        <div className={styles.bread}>
          首页 / 区块#{detail.ref_block_num} / 交易详情
        </div>

        <div className={styles.basic}>
          <div><span className={styles.title}>交易Hash:</span> {detail.id}</div>

          <div className={styles.line}>
            <div className={styles.left}>过期时间：{detail.expiration}</div>
            <div className={styles.right}>签名: {signatures}</div>
          </div>
          <div className={styles.line}>
            <div>所在区块：<a href="javascript:void(0)" onClick={ ()=> {this.toBlockPage(detail.block_num)} }>#{detail.block_num}</a></div>
          </div>
          <div className={styles.line}>
            <div>引用区块：<a href="javascript:void(0)" onClick={ ()=> {this.toBlockPage(detail.block_num)} }>#{detail.ref_block_num}</a></div>
          </div>
          <div className={styles.line}>
            <div>确认数：-- </div>
          </div>
          <div className={styles.line}>
            <div>max_net_usage_words：{detail.max_kcpu_usage} </div>
          </div>
          <div className={styles.line}>
            <div>max_kcpu_usage：{detail.max_kcpu_usage} </div>
          </div>
          <div className={styles.line}>
            <div>delay_sec：{detail.delay_sec}</div>
          </div>
          <div className={styles.line}>
            <div>压缩数据：{detail.packed_trx} </div>
          </div>

        </div>
        <div className={styles.detail}>
          <Tabs defaultActiveKey="1" onChange={()=>{}}>
            <TabPane tab={tab1} key="1">
              <Table
                showHeader={false}
                dataSource={dataSource}
                columns={this.columns}
                pagination={false}
              />
            </TabPane>
            <TabPane tab="RAW数据" key="2"  forceRender={true}>
              <pre ref={(r) => { this.mypre = r; }} >
              </pre>
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default connect()(Trade);