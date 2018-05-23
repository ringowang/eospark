import React,{Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Tabs,Spin } from 'antd';
import MyTable from '../../components/MyTable';
import styles from './css/Block.css';
import * as tool from '../../utils/tool';
import NotFound from '../../components/NotFound';

const TabPane = Tabs.TabPane;

class BlockProducer extends Component{
  constructor(props){
    super(props);
    this.state = {
      detail: {},
      dataSource: [],
      loading: true,
      loadingDetail: true,
      count: 0,
    };
    this.columns = [{
      title: '区块',
      dataIndex: 'block_num',
      render: text => <div><a href="javascript:void(0);" onClick={()=>{this.toBlockPage(text)}}>{text}</a></div>,
    },
      {
        title: '交易数',
        dataIndex: 'total_transaction_num',
        render: (text) => tool.formatNumber(text),
      },
      {
        title: '时间',
        dataIndex: 'timestamp',
      },
  ];
  }

  toBlockPage = (id)=>{
    this.props.dispatch(routerRedux.push(tool.getUri('/block/'+id)));
  };

  componentWillReceiveProps(nextProps){
    console.log('》》》props变化', nextProps);
    if(this.props.match.params.id != nextProps.match.params.id){
      console.log('重新请求');
      this.init(nextProps.match.params.id);
    }
  }

  init = (id) => {
    this.props.dispatch({
      type: 'eos/getBPDetail',
      params:{
        account: id,
      },
      callback: (data)=>{
        this.setState({
          loadingDetail: false,
        });
        if(data.bp_info.length > 0){
          this.setState({
            detail: data.bp_info[0]
          });
        }
      }
    });
  };

  componentWillMount(){
    this.init(this.props.match.params.id);
  }

  getBPBlock = (pageIndex, pageSize)=>{
    this.props.dispatch({
      type: 'eos/getBPBlock',
      params:{
        account: this.props.match.params.id,
        page_num: pageIndex,
        page_size: pageSize,
      },
      callback: (data)=>{
        this.setState({
          loading: false,
          dataSource: data.block_info,
          count: data.total,
        })
      }
    });
  };

  renderNotFound = ()=>{
    return (
      <NotFound/>
    );
  };

  renderDetail = () => {
    let {detail,dataSource} = this.state;
    return (
      <div>
        <div className={styles.bread}>
          首页 / 超级节点
        </div>
        <div className={styles.basic}>
          <div className={styles.title}>{detail.name}</div>

          <div className={styles.line}>
            <div className={styles.left}>票数：{tool.formatNumber(detail.total_vote_num)}</div>
            <div className={styles.right}>网站: <a target='_blank' href={detail.website}>{detail.website}</a></div>
          </div>
          <div className={styles.line}>
            <div className={styles.left}>票数排名：{detail.ranking}</div>
            <div className={styles.right}>账号：<a>{detail.account}</a></div>
          </div>
          <div className={styles.line}>
            <div className={styles.left}>首次出块时间：{detail.first_block_timestamp} </div>
          </div>
        </div>
        <div className={styles.detail}>
          <Tabs defaultActiveKey="1" onChange={()=>{}}>
            <TabPane tab="简介" key="1">
              <div>
                {detail.introduction}
              </div>
            </TabPane>
            <TabPane tab="区块" key="2">
              <MyTable
                loading={this.state.loading}
                dataSource={dataSource}
                columns={this.columns}
                count={this.state.count}
                getTableData={this.getBPBlock}
                rowKey={(record)=>{return record.block_num}}
              />
            </TabPane>

          </Tabs>
        </div>
      </div>
    );
  }

  render(){
    let {detail,loadingDetail} = this.state;
    if(loadingDetail){
      return (
        <div className={styles.spinWrapper}>
          <Spin />
        </div>
      );
    } else if(detail.name){
      return this.renderDetail();
    }else{
      return this.renderNotFound();
    }
  }

}

export default connect()(BlockProducer);