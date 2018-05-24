import React,{Component} from 'react';
import { connect } from 'dva';
import { Route, routerRedux,withRouter } from 'dva/router';
import { Layout,Select,Input,LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import Config from '../../config/index';
import styles from "./EosBasicLayout.css";
//import logo from '../../assets/logo.png';
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

    /**
     地址：以EOS开头的字符串且长度为53位
     区块：纯数字就认为是区块的高度   如果以至少3个0开头且长度为64位的字符串就认为是区块hash
     账户：长度不超过12位的字符串
     交易：剩下的且长度为64位当作交易的hash来处理

     长度介于12到64位 或者超过64位的字符串 我们直接给他跳转到谷歌搜索吧 哈哈哈
     */

    let prefix = '/' + this.getNetType();
    if(value && value.trim()!=''){
      value = value.trim();
      let len = value.length;
      let flag = 0;
      if(len == 53){
        if(value.toLowerCase().indexOf("eos") === 0){
          window.location = window.location.origin + prefix + '/address/'+value;
          flag = 1;
        }
      }else if(len == 64){
        flag = 1;
        if(value.toLowerCase().indexOf('000') === 0){
          window.location = window.location.origin + prefix + '/block/'+value;
        }else{
          window.location = window.location.origin + prefix + '/tx/'+value;
        }
      } else if(len <= 12){
        flag = 1;
        if(!isNaN(value)){
          window.location = window.location.origin + prefix + '/block/'+value;
        }else{
          window.location = window.location.origin + prefix + '/account/'+value;
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
            <img src="http://eospark.com/logo.png" style={{height:50}}/>
          </a>
        <Search placeholder="区块/交易/地址/账户"
                value={this.state.keyword}
                onChange={this.onChange}
                onSearch={value => this.search(value)}
                enterButton="搜索"
                size="large"
                style={{width: 600, marginRight:200}} />
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
            <Content style={{background: '#f0f2f5'}}>
              <div className={styles.content}>
                <LocaleProvider locale={zhCN}>
                 <Component {...matchProps}/>
                </LocaleProvider>
              </div>
            </Content>
        </Layout>
      </div>
    )}/>
  );
};

export default EosBasicLayout;
