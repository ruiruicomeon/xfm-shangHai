import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import { listCpProductSalesFrom, addCpProductSalesFrom , deleteCpProductSalesFrom , getCpProductSalesFrom } from '../services/api';

export default {
  namespace: 'cpProductSalesFrom',

  state: {
    cpProductSalesFromList: {
      list: [],
      pagination: {},
    },
    cpProductSalesFromNotPageList: [],
    cpProductSalesFromTreeDataList:[],
    cpProductSalesFromGet: {}
  },

  effects: {
    *cpProductSalesFrom_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpProductSalesFrom, value);
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
        type: 'cpProductSalesFromList',
        payload: dataMSG,
      });
    },
    *cpProductSalesFrom_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpProductSalesFrom, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *cpProductSalesFrom_Get({ payload, callback }, { call, put }) {
    const value = jsonToFormData(payload);
      const response = yield call(getCpProductSalesFrom, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpProductSalesFromGet',
        payload: response.data,
      });
    },
    *cpProductSalesFrom_Delete({ payload, callback }, { call }) {
    const value = jsonToFormData(payload);
      const response = yield call(deleteCpProductSalesFrom, value);
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
    cpProductSalesFromList(state, action) {
      return {
        ...state,
        cpProductSalesFromList: action.payload,
      };
    },
    cpProductSalesFromNotPageList(state, action) {
      return {
        ...state,
        cpProductSalesFromNotPageList: action.payload,
      };
    },
    cpProductSalesFromTreeDataList(state, action) {
      return {
        ...state,
        cpProductSalesFromTreeDataList: action.payload,
      };
    },
    cpProductSalesFromGet(state, action) {
      return {
        ...state,
        cpProductSalesFromGet: action.payload,
      };
    },
    clear(state) {
      return {
        ...state,
        // cpProductSalesFromList: {
        //   list: [],
        //   pagination: {},
        // },
        cpProductSalesFromNotPageList: [],
        cpProductSalesFromTreeDataList:[],
        cpProductSalesFromGet: {},
        // ...state
      }
    }
  },
};

