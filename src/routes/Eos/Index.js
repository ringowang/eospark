import React,{Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Table,Row, Col } from 'antd';
import styles from './css/Block.css';
import DataSet from '@antv/data-set';
import moment from 'moment';
import requestService from '../../services/request';
import * as tool from '../../utils/tool';

class Index extends Component{

  constructor(props){
    super(props);
    this.state = {
      basicInfo: {},
      dataSource: [],
      recentBlocks:[],
    };
    this.t = null;
    this.t2 = null;

    this.columns = [{
      title: '排名',
      dataIndex: 'ranking',
      key: 'ranking',
    },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        render: (text) => <div><a href="javascript:void(0);" onClick={() => this.toBPPage(text)}>{text}</a></div>,
      },
      {
        title: '票数',
        dataIndex: 'total_vote_num',
        key: 'total_vote_num',
        render: (text) => tool.formatNumber(text),
      },
      {
        title: '已生成区块数',
        dataIndex: 'total_block_num',
        key: 'total_block_num',
        render: (text) => tool.formatNumber(text),
      }
    ];
  }

  getRecentBlocks = ()=>{
    this.props.dispatch({
      type: 'eos/getRecentBlocks',
      params:{
        interface_name: 'get_block_info',
        page_num: 1,
        page_size: 20
      },
      callback: (data) => {
        this.setState({
          recentBlocks: data.block_info
        });
      }
    });
  };

  getTrend = (flag = false)=>{
    let end = moment().format('YYYY-MM-DD HH:mm:ss');
    let start = moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss');
    this.props.dispatch({
      type: 'eos/getPriceTrend',
      params:{
        interface_name: 'get_coin_info',
        start: start,
        end: end,
      },
      callback: (data)=>{
        this.setState({
          priceTrend: data.coin_info
        });

        if(flag){
          //采集12个数据进来
          let drawData = [];
          let coinInfo = data.coin_info;
          let a = coinInfo.length / 10;
          a = Math.floor(a);
          drawData.push(coinInfo[0]);
          for(let i = 1; i <= 10; i++ ){
            // console.log(a*i, coinInfo[a*i]);
            drawData.push(coinInfo[a*i]);
          }
          drawData.push(coinInfo[coinInfo.length-1]);

          this.drawChart(drawData);
        }
      }
    });
  };

  getBasicInfo = ()=>{
    this.props.dispatch({
      type: 'eos/getBasicInfo',
      params: {
        interface_name: 'get_base_info'
      },
      callback: (data)=>{
        this.setState({
          basicInfo: data
        })
      }
    });
  };

  componentWillMount(){

    this.t = setInterval(()=>{
      this.getRecentBlocks();
      this.getBasicInfo();
    },2000);
    this.getRecentBlocks();
    this.getBasicInfo();

    this.t2 = setInterval(()=>{
      this.getTrend();
    },5000);
    this.getTrend(true);

    this.props.dispatch({
      type: 'eos/getBPBasicInfo',
      params:{
        interface_name: 'get_bp_info'
      },
      callback: (data)=>{
        this.setState({
          dataSource: data.base_info
        })
      }
    });
  }

  componentDidMount(){
    this.drawMap();
  }

  componentWillUnmount(){
    this.t && clearInterval(this.t);
    this.t2 && clearInterval(this.t2);
  }

  toBlockPage = (id)=>{
    this.props.dispatch(routerRedux.push(tool.getUri('/block/'+id)));
  };

  toBPPage = (id)=>{
    this.props.dispatch(routerRedux.push(tool.getUri('/bp/'+id)));
  };

  drawChart = (data)=>{
    document.getElementById('myChart').innerHTML = "";
    // console.log('要绘制的折线图数据',data);
    const chart = new G2.Chart({
      container: 'myChart',
      forceFit: false,
      width: 340,
      height: 300,
      padding: 50
    });
    chart.source(data);

    //http://antvis.github.io/g2/doc/tutorial/start/axis.html  formatter 坐标轴的格式化展示
    chart.scale({
      market_cap: {
        min: 10000000000
      },
      timestamp: {
        type: 'time',
        mask: 'YYYY-MM-DD HH:mm:ss',
        range: [ 0 , 1 ],
      }
    });

    chart.axis('market_cap', {
      label: {
        formatter: val => {
          return (val / 100000000).toFixed(0) + '亿';
        }
      }
    });

    let date = '';
    chart.axis('timestamp', {
      label: {
        formatter: val => {
          // console.log('时间', val);
          let m = new moment(val);
          if(date == ''){
            date = m.format('MM-DD');
            return m.format('HH:mm');
          }else if(m.format('MM-DD') != date){
            date = m.format('MM-DD');
            return m.format('MM-DD');
          }else{
            return m.format('HH:mm');
          }
        }
      }
    });

    chart.tooltip(false);

    chart.area().position('timestamp*market_cap').shape('smooth');
    chart.line().position('timestamp*market_cap').size(2).shape('smooth');

    chart.render();
  };

  drawMap = ()=>{
    var earthquakeData = [
      {
        'name': '亚洲超级节点',
        'location': 'Near Dali (Talifu, Ta-li), Yunnan, China',
        'lat': '25.7',
        'lng': '100.2',
        'num': 1000
      }, {
        'name': '飞侠节点',
        'location': 'Tango, Japan',
        'lat': '35.8',
        'lng': '134.8',
        'num':998
      }];

    requestService.exec('https://antvis.github.io/static/data/world.geo.json').then((mapData)=>{

      const chart = new G2.Chart({
        container: 'mountNode',
        forceFit: true,
        height: 400,
        padding: [ 0, 20, 0 ]
      });
      // force sync scales
      chart.scale({
        x: { sync: true, nice: false },
        y: { sync: true, nice: false }
      });
      chart.coord().reflect();
      chart.legend(false);
      chart.axis(false);

      // style the tooltip
      chart.tooltip({
        showTitle: false,
      });

      // data set
      const ds = new DataSet();

      // draw the map
      const dv = ds.createView('back')
        .source(mapData, {
          type: 'GeoJSON'
        })
        .transform({
          type: 'geo.projection',
          projection: 'geoMercator',
          as: [ 'x', 'y', 'centroidX', 'centroidY' ]
        });
      const bgView = chart.view();
      bgView.source(dv);
      bgView.tooltip(false);
      bgView.polygon()
        .position('x*y')
        .style({
          fill: '#DDDDDD',
          stroke: '#b1b1b1',
          lineWidth: 0.5,
          fillOpacity: 0.85
        });

      // draw the bubble plot
      var data = earthquakeData;
      const userData = ds.createView().source(data);
      userData.transform({
        type: 'map',
        callback: obj => {
          const projectedCoord = dv.geoProjectPosition([obj.lng * 1, obj.lat * 1], 'geoMercator');
          obj.x = projectedCoord[0];
          obj.y = projectedCoord[1];
          return obj;
        }
      });
      const pointView = chart.view();
      pointView.source(userData);
      pointView.point()
        .position('x*y')
        .size('num', [2, 30])
        .shape('circle')
        .opacity(0.45)
        .color('#2592fc')
        .tooltip('name*num');

      chart.render();
    });
  };

  renderLeft = ()=>{
    let {basicInfo,dataSource} = this.state;
    return (
      <div style={{ marginRight: 10}}>
        <div className={styles.basic}>
          <div>
            <span className={styles.impText}>全网预览</span>
          </div>
        </div>
        <div className={styles.line2}></div>
        <div className={styles.basic}>
          <div className={styles.summary}>
            <div className={styles.summaryItem}>
              <div>区块数量</div>
              <div className={styles.impText}>{tool.formatNumber(basicInfo.head_block_num)}</div>
            </div>
            <div className={styles.summaryItem}>
              <div>交易数量</div>
              <div className={styles.impText}>{tool.formatNumber(basicInfo.total_transaction_num)}</div>
            </div>
            <div className={styles.summaryItem}>
              <div>消息数量</div>
              <div className={styles.impText}>{tool.formatNumber(basicInfo.total_action_num)}</div>
            </div>
            <div className={styles.summaryItem}>
              <div>账户数量</div>
              <div className={styles.impText}>{tool.formatNumber(basicInfo.total_account_num)}</div>
            </div>
          </div>
          <div id="mountNode"></div>
        </div>
        <div className={styles.basic} style={{marginTop: 10}}>
          <div>
            <span className={styles.impText}>超级节点列表</span>
          </div>
        </div>
        <div className={styles.line2}></div>
        <div className={styles.basic}>
          <Table
            dataSource={dataSource}
            columns={this.columns}
            pagination={false}
          />
        </div>
      </div>
    );
  };

  renderNewBlock = (item,index)=>{
    var from_date = new Date(item.timestamp);
    var end_date = new Date();
    var time_different = (end_date - from_date) / 86400;

    return (
      <div key={index} style={{display: 'flex', justifyContent:'space-between'}}>
        <a onClick={()=>{this.toBlockPage(item.block_num)}}>#{item.block_num}</a>
        <span>{item.producer}</span>
        <span>{Math.ceil(time_different)}秒前</span>
      </div>
    );
  };

  renderRight = ()=>{
    let data = this.state.recentBlocks;

    let {priceTrend} = this.state;
    let currentPrice = '--';
    let rate = '--';
    let currentValue = '';
    let _style = {color:'green', marginLeft: 5};
    if(priceTrend && priceTrend.length > 0){
      currentPrice = tool.formatNumber(priceTrend[priceTrend.length - 1].price) + ' USD';
      currentValue = tool.formatNumber(priceTrend[priceTrend.length - 1].market_cap) + ' USD';
      let b = priceTrend[priceTrend.length - 1].price - priceTrend[0].price;
      let k = (b/priceTrend[0].price).toFixed(2);
      rate = k + '%';
      if(k < 0){
        _style = {color:'red', marginLeft: 5};
      }
    }
    return (
      <div>
        <div className={styles.basic}>
          <div>
            <span className={styles.impText}>价格走势</span>
          </div>
        </div>
        <div className={styles.line2}></div>
        <div className={styles.basic}>
          <div>
            当前价格
          </div>
          <div>
            <span>{currentPrice}</span><span style={_style}>{rate}</span>
          </div>
          <div style={{marginTop: 5}}>
            当前市值
          </div>
          <div>
            <span>{currentValue}</span>
          </div>
          <div id="myChart"></div>
        </div>

        <div className={styles.basic} style={{marginTop: 10}}>
          <div>
            <span className={styles.impText}>最新区块</span>
          </div>
        </div>
        <div className={styles.line2}></div>
        <div className={styles.basic}>
          {
            data.map((item,index)=>{
              return this.renderNewBlock(item,index);
            })
          }
        </div>
      </div>
    );
  };

  render(){
    let {basicInfo,dataSource} = this.state;

    return (
      <div>
        <Row>
          <Col span={18}>
            {this.renderLeft()}
          </Col>
          <Col span={6}>
            {this.renderRight()}
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect()(Index);