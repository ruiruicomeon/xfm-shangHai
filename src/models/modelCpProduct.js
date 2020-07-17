import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import { salesCpProduct ,listCpProduct, addCpProduct , deleteCpProduct , getCpProduct } from '../services/api';

export default {
  namespace: 'cpProduct',

  state: {
    cpProductList: {
      list: [],
      pagination: {},
    },
    cpProductNotPageList: [],
    cpProductTreeDataList:[],
    cpProductGet: {}
  },

  effects: {
    *sales_CpProduct({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(salesCpProduct, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("退货成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("退货失败");
      }
    },

    *cpProduct_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpProduct, value);
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
        type: 'cpProductList',
        payload: dataMSG,
      });
    },

    *cpProduct_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpProduct, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },

    *cpProduct_save_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpProduct, value);
      if (isNotBlank(response) && response.success === '1') {
        if (callback) callback();
      } 
      // else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
      // } else {
      //   message.error("新增失败");
      // }
    },
    *cpProduct_Get({ payload, callback }, { call, put }) {
    const value = jsonToFormData(payload);
      const response = yield call(getCpProduct, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpProductGet',
        payload: response.data,
      });
    },
    *cpProduct_Delete({ payload, callback }, { call }) {
    const value = jsonToFormData(payload);
      const response = yield call(deleteCpProduct, value);
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
    cpProductList(state, action) {
      return {
        ...state,
        cpProductList: action.payload,
      };
    },
    cpProductNotPageList(state, action) {
      return {
        ...state,
        cpProductNotPageList: action.payload,
      };
    },
    cpProductTreeDataList(state, action) {
      return {
        ...state,
        cpProductTreeDataList: action.payload,
      };
    },
    cpProductGet(state, action) {
      return {
        ...state,
        cpProductGet: action.payload,
      };
    },
    clear(state) {
      return {
        ...state,
        // cpProductList: {
        //   list: [],
        //   pagination: {},
        // },
        cpProductNotPageList: [],
        cpProductTreeDataList:[],
        cpProductGet: {},
      }
    }
  },
};


