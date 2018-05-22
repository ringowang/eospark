import React,{Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

class NotFound extends Component {
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div>
        <h1 style={{textAlign:'center'}}>抱歉，未找到相关信息</h1>
      </div>
    );
  }
}

export default connect()(NotFound);