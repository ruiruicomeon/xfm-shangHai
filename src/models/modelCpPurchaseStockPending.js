import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import {updateStayMarketFrom, getStayMarketFromList ,postStayMarketFrom , deleteStayMarketFrom , postNBCpPurchaseStockPending,
  postCpPurchaseStockPending , listCpPurchaseStockPending, addCpPurchaseStockPending , deleteCpPurchaseStockPending, 
  updateCpPurchaseStockPending, getCpPurchaseStockPending ,postBatchStayMarketFrom } from '../services/api';

export default {
  namespace: 'cpPurchaseStockPending',

  state: {
    cpPurchaseStockPendingList: {
      list: [],
      pagination: {},
    },
    cpPurchaseStockPendingNotPageList: [],
    cpPurchaseStockPendingTreeDataList:[],
    cpPurchaseStockPendingGet: {}
  },
  getStayMarketFromList: {
    list: [],
    pagination: {},
  },
  effects: {
    *post_BatchStayMarketFrom({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(postBatchStayMarketFrom, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("操作成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("操作失败");
      }
    },

    *update_StayMarketFrom({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(updateStayMarketFrom, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("操作成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("操作失败");
      }
    },

    *delete_StayMarketFrom({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deleteStayMarketFrom, value);
      if (isNotBlank(response) && (response.success === '1' || response.success === 1)) {
        message.success("删除成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0)) {
        message.error("删除失败");
      }
    },

    *post_StayMarketFrom({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(postStayMarketFrom, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("操作成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("操作失败");
      }
    },


    *get_StayMarketFromList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getStayMarketFromList, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'getStayMarketFromList',
        payload: dataMSG,
      });
    },


    *post_NB_CpPurchaseStockPending({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(postNBCpPurchaseStockPending, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("操作成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("操作失败");
      }
    },

    *post_CpPurchaseStockPending({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(postCpPurchaseStockPending, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("操作成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("操作失败");
      }
    },


    *cpPurchaseStockPending_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpPurchaseStockPending, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'cpPurchaseStockPendingList',
        payload: dataMSG,
      });
    },
    *cpPurchaseStockPending_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpPurchaseStockPending, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *cpPurchaseStockPending_Update({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(updateCpPurchaseStockPending, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("修改成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("修改失败");
      }
    },
    *cpPurchaseStockPending_Get({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpPurchaseStockPending, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpPurchaseStockPendingGet',
        payload: response.data,
      });
    },
    *cpPurchaseStockPending_Delete({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deleteCpPurchaseStockPending, value);
      if (isNotBlank(response) && (response.success === '1' || response.success === 1)) {
        message.success("删除成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0)) {
        message.error("删除失败");
      }
    },
  },
  reducers: {
    cpPurchaseStockPendingList(state, action) {
      return {
        ...state,
        cpPurchaseStockPendingList: action.payload,
      };
    },
    cpPurchaseStockPendingNotPageList(state, action) {
      return {
        ...state,
        cpPurchaseStockPendingNotPageList: action.payload,
      };
    },
    cpPurchaseStockPendingTreeDataList(state, action) {
      return {
        ...state,
        cpPurchaseStockPendingTreeDataList: action.payload,
      };
    },
    cpPurchaseStockPendingGet(state, action) {
      return {
        ...state,
        cpPurchaseStockPendingGet: action.payload,
      };
    },
    getStayMarketFromList(state, action) {
      return {
        ...state,
        getStayMarketFromList: action.payload,
      };
    },
    clear(state) {
      return {
        ...state,
        // cpPurchaseStockPendingList: {
        //   list: [],
        //   pagination: {},
        // },
        // getStayMarketFromList: {
        //   list: [],
        //   pagination: {},
        // },
        cpPurchaseStockPendingNotPageList: [],
        cpPurchaseStockPendingTreeDataList:[],
        cpPurchaseStockPendingGet: {},
        
      }
    }
  },
};

