import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import {getCpSalesAccessoriesMoneyList,getCpSalesAccessoriesMoney,CpSalesAccessoriesMoneyDelete,CpSalesAccessoriesMoneySave,
  postCpSalesAccessoriesMoney } from '../services/api';

export default {
  namespace: 'cpAccessoriesSalesPrice',

  state: {
    getCpSalesAccessoriesMoneyList: {
      list: [],
      pagination: {},
    },
    // cpAfterEntrustFromNotPageList: [],
    // cpAfterEntrustFromTreeDataList:[],
    getCpSalesAccessoriesMoney: {}
  },

  effects: {

    *CpSalesAccessoriesMoney_Save({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(CpSalesAccessoriesMoneySave, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("操作成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("操作失败");
      }
    },

    // *cpAfterEntrust_Revocation({ payload, callback }, { call }) {
    //   const value = jsonToFormData(payload);
    //   const response = yield call(cpAfterEntrustRevocation, value);
    //   if (isNotBlank(response) && response.success === '1') {
    //     message.success("撤销成功");
    //     if (callback) callback();
    //   } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
    //     message.error(response.msg);
    //   } else {
    //     message.error("撤销失败");
    //   }
    // },

    *get_CpSalesAccessoriesMoneyList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpSalesAccessoriesMoneyList, value);
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
        type: 'getCpSalesAccessoriesMoneyList',
        payload: dataMSG,
      });
    },
    *post_CpSalesAccessoriesMoney({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(postCpSalesAccessoriesMoney, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *get_CpSalesAccessoriesMoney({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpSalesAccessoriesMoney, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'getCpSalesAccessoriesMoney',
        payload: response.data,
      });
    },
    *CpSalesAccessoriesMoney_Delete({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(CpSalesAccessoriesMoneyDelete, value);
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
    getCpSalesAccessoriesMoneyList(state, action) {
      return {
        ...state,
        getCpSalesAccessoriesMoneyList: action.payload,
      };
    },
    // cpAfterEntrustFromNotPageList(state, action) {
    //   return {
    //     ...state,
    //     cpAfterEntrustFromNotPageList: action.payload,
    //   };
    // },
    // cpAfterEntrustFromTreeDataList(state, action) {
    //   return {
    //     ...state,
    //     cpAfterEntrustFromTreeDataList: action.payload,
    //   };
    // },
    getCpSalesAccessoriesMoney(state, action) {
      return {
        ...state,
        getCpSalesAccessoriesMoney: action.payload,
      };
    },
    clear(state) {
      return {
        ...state,
        // getCpSalesAccessoriesMoneyList: {
        //   list: [],
        //   pagination: {},
        // },
        // cpAfterEntrustFromNotPageList: [],
        // cpAfterEntrustFromTreeDataList:[],
        getCpSalesAccessoriesMoney: {},
      }
    }
  },
};

