import React,{Component} from 'react';
import { connect } from 'dva';
import { Route, routerRedux,withRouter } from 'dva/router';
import { Layout,Select,Input,LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import Config from '../../config/index';
import styles from "./EosBasicLayout.css";
import logo from '../../assets/logo.png';
const { Header, Content } = Layout;
const Search = Input.Search;
const Option = Select.Option;

class MyHeader extends Component{
  constructor(props){
    super(props);
    console.log('========', this.props);
    let _netType = 'mainnet';

    let url = this.props.match.url;
    let a = url.split('/');
    if(a.length > 1){
      let netType = Config.netType.getInstance();
      if(a[1] === 'testnet'){
        _netType = 'testnet';
        netType.setName('testnet');
      }else{
        netType.setName('mainnet');
      }
    }

    this.state = {
      keyword: '',
      netType:_netType
    };
  }

  handleChange = (v)=>{
    console.log('网络切换',v);
    let netType = Config.netType.getInstance();
    netType.setName(v);
    window.location = window.location.origin + '/' + v;
  };


  getNetType = ()=>{
    let netType = Config.netType.getInstance();
    return netType.getName();
  };

  search = (value)=>{
    // 地址， eos开头的长字符串，20个字符以上
    // 账户， 短字符串，20个字符以下
    // 交易， 000开头的长字符串，20个字符以上
    // 区块， number类型，1千万以内
    // BP, 暂时不考虑

    let prefix = '/' + this.getNetType();
    if(value && value.trim()!=''){
      value = value.trim();
      let len = value.length;
      if(len > 20){
        if(value.indexOf('eos') === 0){
          window.location = window.location.origin + prefix + '/address/'+value;
          //this.props.dispatch(routerRedux.push(prefix + '/address/'+value));
        }else{
          window.location = window.location.origin + prefix + '/tx/'+value;
          //this.props.dispatch(routerRedux.push(prefix + '/tx/'+value));
        }
      }else{
        if(isNaN(value)){
          window.location = window.location.origin + prefix + '/account/'+value;
          //this.props.dispatch(routerRedux.push(prefix + '/account/'+value));
        }else{
          window.location = window.location.origin + prefix + '/block/'+value;
          //this.props.dispatch(routerRedux.push(prefix + '/block/'+value));
        }
      }
      this.setState({
        keyword: ''
      });
    }
  };

  toIndex = ()=>{
    let netType = this.getNetType();
    this.props.dispatch(routerRedux.push('/' + netType));
  };

  onChange = (e) => {
    this.setState({ keyword: e.target.value });
  };

  render(){
    return (
      <Header style={{background: 'white',paddingLeft:2}}>
        <div className={styles.headerContent}>
          <a href="javascript:void(0)" onClick={this.toIndex}>
            <img src={logo} style={{height:50}}/>
          </a>
        <Search placeholder="区块/交易/地址/账户/BP"
                value={this.state.keyword}
                onChange={this.onChange}
                onSearch={value => this.search(value)}
                enterButton="搜索"
                size="large"
                style={{width: 400, marginRight:200}} />
        <Select value={this.state.netType}  defaultValue="mainnet" style={{ width: 80 }} onChange={this.handleChange}>
          <Option value="mainnet">主网</Option>
          <Option value="testnet">测试网</Option>
        </Select>
        </div>
      </Header>
    );
  }
}

const EosHeader = withRouter(connect()(MyHeader));

const EosBasicLayout = ({component:Component, ...rest})=>{
  return (
    <Route  {...rest} render= { matchProps => (
      <div style={{height:'100%'}}>
        <Layout style={{height:'100%'}}>
            <EosHeader/>
            <Content className={styles.content}>
              <LocaleProvider locale={zhCN}>
               <Component {...matchProps}/>
              </LocaleProvider>
            </Content>
        </Layout>
      </div>
    )}/>
  );
};

export default EosBasicLayout;
