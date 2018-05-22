import requestService from '../services/request';
import dataApi from '../config/api';
import Config from "../config/index";
import * as tool from "../utils/tool";
import {routerRedux} from 'dva/router';
import {getErrMsg} from '../config/errCode';

export default {

  namespace: 'eos',

  state: {},


  subscriptions:{

  },

  effects: {
    //==============首页=================
    // 首页，获取概述信息
    * getBasicInfo({ params={}, callback, errCallback }){
      console.log('》》》》》容老夫来获取基本信息');
      params.interface_name = "get_base_info";
      const rs = yield requestService.exec(params);
      if (rs === false) return;
      if (rs.errno == 0){
        callback && callback(rs.data);
      } else {
        errCallback && errCallback(rs.errmsg);
      }
    },

    //首页， 获取超级节点信息
    * getBPBasicInfo({ params={}, callback, errCallback }){
      params.interface_name = "get_bp_info";
      const rs = yield requestService.exec(params);
      if (rs === false) return;
      if (rs.errno == 0){
        callback && callback(rs.data);
      } else {
        errCallback && errCallback(rs.errmsg);
      }
    },


    // 首页，获取最新的区块
    * getRecentBlocks({ params={}, callback, errCallback }){
      params.interface_name = 'get_block_info';
      const rs = yield requestService.exec(params);
      if (rs === false) return;
      if (rs.errno == 0){
        callback && callback(rs.data);
      } else {
        errCallback && errCallback(rs.errmsg);
      }
    },

    // 首页，获取价格趋势
    * getPriceTrend({ params={}, callback, errCallback }){
      params.interface_name = 'get_coin_info';
      const rs = yield requestService.exec(params);
      if (rs === false) return;
      if (rs.errno == 0){
        callback && callback(rs.data);
      } else {
        errCallback && errCallback(rs.errmsg);
      }
    },
    //================区块==================
    // 获取区块详情
    * getBlockDetail({ params={}, callback, errCallback }){
      params.interface_name = 'get_block_detail_info';
      const rs = yield requestService.exec(params);
      if (rs === false) return;
      if (rs.errno == 0){
        callback && callback(rs.data);
      } else {
        errCallback && errCallback(rs.errmsg);
      }
    },

    // 获取区块下的交易信息
    * getBlockTrade({ params={}, callback, errCallback }){
      params.interface_name = 'get_block_transaction_info';
      const rs = yield requestService.exec(params);
      if (rs === false) return;
      if (rs.errno == 0){
        callback && callback(rs.data);
      } else {
        errCallback && errCallback(rs.errmsg);
      }
    },
    //===========交易===============
    // 获取交易详情
    * getTradeDetail({ params={}, callback, errCallback }){
      params.interface_name = 'get_transaction_detail_info';
      const rs = yield requestService.exec(params);
      if (rs === false) return;
      if (rs.errno == 0){
        callback && callback(rs.data);
      } else {
        errCallback && errCallback(rs.errmsg);
      }
    },

    // 获取某个交易下的消息
    * getTradeAction({ params={}, callback, errCallback }){
      params.interface_name = 'get_transaction_action_info';
      const rs = yield requestService.exec(params);
      if (rs === false) return;
      if (rs.errno == 0){
        callback && callback(rs.data);
      } else {
        errCallback && errCallback(rs.errmsg);
      }
    },

    //============地址===============
    // 获取地址基本信息
    * getAddressDetail({ params={}, callback, errCallback }){
      params.interface_name = 'get_address_detail_info';
      const rs = yield requestService.exec(params);
      if (rs === false) return;
      if (rs.errno == 0){
        callback && callback(rs.data);
      } else {
        errCallback && errCallback(rs.errmsg);
      }
    },

    //============账户===============
    // 获取账户基本信息
    * getAccountDetail({ params={}, callback, errCallback }){
      params.interface_name = 'get_account_detail_info';
      const rs = yield requestService.exec(params);
      if (rs === false) return;
      if (rs.errno == 0){
        callback && callback(rs.data);
      } else {
        errCallback && errCallback(rs.errmsg);
      }
    },

    // 获取账户下的交易信息
    * getAccountTrade({ params={}, callback, errCallback }){
      params.interface_name = 'get_account_transaction_info';
      const rs = yield requestService.exec(params);
      if (rs === false) return;
      if (rs.errno == 0){
        callback && callback(rs.data);
      } else {
        errCallback && errCallback(rs.errmsg);
      }
    },

    //===========超级节点==========
    // 获取超级节点详情
    * getBPDetail({ params={}, callback, errCallback }){
      params.interface_name = "get_bp_info";
      const rs = yield requestService.exec(params);
      if (rs === false) return;
      if (rs.errno == 0){
        callback && callback(rs.data);
      } else {
        errCallback && errCallback(rs.errmsg);
      }
    },
    // 获取某个超级节点的区块列表
    * getBPBlock({ params={}, callback, errCallback }){
      params.interface_name = 'get_account_block_info';
      const rs = yield requestService.exec(params);
      if (rs === false) return;
      if (rs.errno == 0){
        callback && callback(rs.data);
      } else {
        errCallback && errCallback(rs.errmsg);
      }
    },

  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
