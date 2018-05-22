import React,{Component,PropTypes} from 'react';
import {Table} from 'antd';


export default class MyTable extends Component{

  static propTypes = {
    dataSource: PropTypes.array,
    columns: PropTypes.array,
    getTableData: PropTypes.func,
    count: PropTypes.number,
  };

  constructor(props){
    super(props);
    this.state = {
      pageSize: 5,
      current: 1,
    };
  }

  componentWillMount(){
    this.props.getTableData(1,this.state.pageSize);
  }

  onChange = (page, pageSize)=>{
    console.log('分页变化', page, pageSize);
    this.props.getTableData(page, pageSize);
    this.setState({
      current: page,
    });
  };

  onShowSizeChange = (current, size)=>{
    console.log('每页数目的变化', current, size);
    this.setState({
      pageSize: size,
      current: 1,
    });
    this.props.getTableData(1,size);
  };

  render(){
    let {dataSource,columns,count,...others} = this.props;
    return (
      <Table
        {...others}
        dataSource={dataSource}
        columns={columns}
        pagination={{
          current: this.state.current,
          total:count,
          showSizeChanger:true,
          showQuickJumper: true,
          hideOnSinglePage: true,
          pageSize: this.state.pageSize,
          pageSizeOptions: ['5','10','15'],
          onChange:this.onChange,
          onShowSizeChange: this.onShowSizeChange
        }}
      >
      </Table>
    );
  }
}