import React,{Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import * as tool from '../../utils/tool';
import { Tabs,Table,Spin } from 'antd';
import styles from './css/Block.css';
import NotFound from '../../components/NotFound';
const TabPane = Tabs.TabPane;

class Address extends Component{
  constructor(props){
    super(props);
    this.state = {
      detail: {},
      dataSource: [],
      loading: true,
    };
    this.columns = [{
      title: '账户名',
      dataIndex: 'account_name',
      key: '1',
      render: text => <div><a href="javascript:void(0);" onClick={()=>{this.toAccountPage(text)}}>{text}</a></div>,
    },
      {
        title: '所在权限组',
        dataIndex: 'perm_name',
        key: '2',
      },
      {
        title: '权重',
        dataIndex: 'weight',
        key: '3',
      },
      {
        title: '阈值',
        dataIndex: 'threshold',
        key: '4',
      }
    ];
  }

  toAccountPage = (id)=>{
    this.props.dispatch(routerRedux.push(tool.getUri('/account/'+id)));
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
      type: 'eos/getAddressDetail',
      params:{
        address: id,
      },
      callback: (data)=>{
        this.setState({
          loading: false,
        });
        let d = this.getDataSource(data.permissions);
        if(d.length > 0){
          this.setState({
            dataSource: d
          })
        }
      },
      errCallback: ()=>{
        this.setState({
          loading: false,
        });
      }
    });
  };

  componentWillMount(){
    this.init(this.props.match.params.id);
  }


  getDataSource = (data)=>{
    let rs = [];
    let k = 0;
    for(let i in data){
      let item = data[i];
      item.required_auth.map((d,index)=>{
        rs.push({
          account_name: index==0 ? item.account_name : '',
          perm_name: d.perm_name,
          threshold: d.threshold,
          weight: d.weight,
          key: k++,
        });
      });
    }
    return rs;
  };

  render(){
    let {dataSource, loading} = this.state;
    if(loading){
      return (
        <div className={styles.spinWrapper}>
          <Spin />
        </div>
      );
    } else if(dataSource.length > 0){
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

  toIndex = ()=>{
    window.location = window.location.origin + tool.getUri('/');
  };

  renderDetail = () => {
    let {dataSource} = this.state;
    let tab1 = `关联账户(${dataSource.length})`;
    return (
      <div>
        <div className={styles.bread}>
          <a href="javascript:void(0)" style={{color:'rgba(0, 0, 0, 0.65)'}} onClick={this.toIndex}>首页</a> / 地址
        </div>

        <div className={styles.basic}>
          <div><span className={styles.title}>地址：</span>{this.props.match.params.id}</div>
        </div>

        <div className={styles.detail}>
          <Tabs defaultActiveKey="1" onChange={()=>{}}>
            <TabPane tab={tab1} key="1">
              <Table locale={{emptyText: '暂无数据'}}
                dataSource={dataSource}
                columns={this.columns}
                pagination={false}
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default connect()(Address);