import React,{Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import * as tool from '../../utils/tool';
import { Tabs,Table,Spin } from 'antd';
import MyTable from '../../components/MyTable';
import styles from './css/Block.css';
import NotFound from '../../components/NotFound';
import ActionItem from '../../components/ActionItem';
const TabPane = Tabs.TabPane;


class Account extends Component{
  constructor(props){
    super(props);
    this.state = {
      detail: {},
      dataSource: [],
      subAccountDataSource:[],
      permDataSource:[],
      loading: true,
      count: 0,
    };


    this.columns = [{
      title: '交易',
      dataIndex: 'id',
      key: 'id',
      render: (text,record) => {return this.renderRow(record);},
    }];

    this.columns2 = [
      {
        title: '组名',
        dataIndex: 'perm_name',
        key: 'perm_name',
      },
      {
        title: '阈值',
        dataIndex: 'threshold',
        key: 'threshold',
      },
      {
        title: '地址/账户',
        dataIndex: 'keyOrAccount',
        key: 'keyOrAccount',
        render: text => <a href="javascript:void(0)" onClick={()=>{this.toPage(text)}}>{text}</a>
      },
      {
        title: '权重',
        dataIndex: 'weight',
        key: 'weight',
      },

    ];

    this.columns3 = [{
      title: '账号',
      dataIndex: 'account_name',
      key: 'account_name',
      render: (text) => {return <a href="javascript:void(0)" onClick={()=>{this.toAccountPage(text)}}>{text}</a>;},
    },
      {
        title: '创建时间',
        dataIndex: 'create_timestamp',
        key: 'create_timestamp',
      }];
  }

  toTradePage = (id)=>{
    this.props.dispatch(routerRedux.push(tool.getUri('/tx/'+id)));
  };

  toAccountPage = (id)=>{
    this.props.dispatch(routerRedux.push(tool.getUri('/account/'+id)));
  };

  toPage = (id)=>{
    if(id.length > 20){
      this.props.dispatch(routerRedux.push(tool.getUri('/address/'+id)));
    }else{
      this.props.dispatch(routerRedux.push(tool.getUri('/account/'+id)));
    }
  };

  renderRow = (record)=>{
    let data = record;
    console.log('>>>>>>>', data);
    if(data){
      let action_info = record.action_info;
      return (
        <div>
          <div className={styles.tradeTbData}>
            <div>交易ID: <a href="javascript:void(0)" onClick={() => {this.toTradePage(data.id);}}>{data.id}</a></div>
            <div>{data.timestamp}</div>
          </div>
          <div>
            {
              action_info.map((item, index) => {
                return ActionItem(item, index);
              })
            }
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
      type: 'eos/getAccountDetail',
      params:{
        account_name: id,
      },
      callback: (data)=>{
        this.setState({
          detail: data,
          subAccountDataSource: data.sub_account,
          permDataSource: this.getDataSource(data.permissions),
          loading: false,
        })
      },
      errCallback: ()=>{
        this.setState({
          loading: false,
        });
      }
    });
  };

  componentWillMount(){

    console.log('我是账户组件，要加载了');

    this.init(this.props.match.params.id);

  }

  getAccountTrade = (pageIndex,pageNum)=>{
    this.props.dispatch({
      type: 'eos/getAccountTrade',
      params:{
        account_name: this.props.match.params.id,
        page_num: pageIndex,
        page_size: pageNum,
      },
      callback: (data)=>{
        this.setState({
          dataSource: data.transaction_info,
          count: data.total,
        })
      }
    });
  };

  getDataSource = (data)=>{
    let rs = [];
    let k = 0;
    for(let i in data){
      let item = data[i];
      item.required_auth.keys && item.required_auth.keys.map((d,index)=>{
        let k = d.key;
        let _key = JSON.parse(k);
        rs.push({
          perm_name: item.perm_name,
          threshold:item.required_auth.threshold,
          keyOrAccount: _key.actor,
          weight: d.weight,
          key: k++,
        });
      });
      item.required_auth.accounts && item.required_auth.accounts.map((d,index)=>{
        rs.push({
          perm_name: item.perm_name,
          threshold:item.required_auth.threshold,
          keyOrAccount: d.account,
          weight: d.weight,
          key: k++,
        });
      });
    }
    return rs;
  };

  onPaginationChange = ()=>{

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
    } else if(detail.creater_account){
      return this.renderDetail();
    }else{
      return this.renderNotFound();
    }
  }

  renderDetail = ()=>{
    let {detail,dataSource,subAccountDataSource,permDataSource} = this.state;
    let signatures = '';
    if(detail.signatures && detail.signatures.length > 0) {
      signatures = detail.signatures.join(',');
    }
    return (
      <div>
        <div className={styles.bread}>
          首页 / 账户
        </div>
        <div className={styles.basic}>
          <div className={styles.title}>账户: {this.props.match.params.id}</div>

          <div className={styles.line}>
            <div>创建时间：{detail.create_timestamp}</div>
          </div>
          <div className={styles.line}>
            <div>创建账户：<a href="javascript:void(0)" onClick={()=>{this.toAccountPage(detail.creater_account)}}>{detail.creater_account}</a></div>
          </div>
        </div>
        <div className={styles.detail}>
          <Tabs defaultActiveKey="1" onChange={()=>{}}>
            <TabPane tab="交易" key="1">
              <MyTable
                showHeader={false}
                dataSource={dataSource}
                columns={this.columns}
                count={this.state.count}
                getTableData={this.getAccountTrade}
                rowKey={record=>record.id}
              />
            </TabPane>
            <TabPane tab="权限组" key="2">
              <Table locale={{emptyText: '暂无数据'}}
                dataSource={permDataSource}
                columns={this.columns2}
                pagination={false}
              />
            </TabPane>
            <TabPane tab="从账号" key="3">
              <Table locale={{emptyText: '暂无数据'}}
                dataSource={subAccountDataSource}
                columns={this.columns3}
                pagination={false}
                rowKey={record=>record.account_name}
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default connect()(Account);