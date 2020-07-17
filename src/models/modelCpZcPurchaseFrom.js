import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import { postZcCpPurchaseDetail, deleteZcCpPurchaseDetail, listCpZcPurchaseFrom, addCpZcPurchaseFrom  , deleteCpZcPurchaseFrom , getCpZcPurchaseFrom  } from '../services/api';

export default {
  namespace: 'cpZcPurchaseFrom',

  state: {
    cpZcPurchaseFromList: {
      list: [],
      pagination: {},
    },
    cpZcPurchaseFromNotPageList: [],
    cpZcPurchaseFromTreeDataList:[],
    cpZcPurchaseFromGet: {}
  },

  effects: {
    *post_ZcCpPurchase_Detail({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(postZcCpPurchaseDetail, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },

    *delete_Zc_CpPurchase_Detail({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deleteZcCpPurchaseDetail, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("删除成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("删除失败");
      }
    },


    *cpZcPurchaseFrom_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpZcPurchaseFrom, value);
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
        type: 'cpZcPurchaseFromList',
        payload: dataMSG,
      });
    },
    *cpZcPurchaseFrom_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpZcPurchaseFrom, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },

    *cpZcPurchaseFrom_Get({ payload, callback }, { call, put }) {
    const value = jsonToFormData(payload);
      const response = yield call(getCpZcPurchaseFrom, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpZcPurchaseFromGet',
        payload: response.data,
      });
    },

    *cpZcPurchaseFrom_print_Get({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
        const response = yield call(getCpZcPurchaseFrom, value);
        if (isNotBlank(response) && isNotBlank(response.data)) {
          if (callback) callback(response);
        }
      },

    *cpZcPurchaseFrom_Delete({ payload, callback }, { call }) {
    const value = jsonToFormData(payload);
      const response = yield call(deleteCpZcPurchaseFrom, value);
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
    cpZcPurchaseFromList(state, action) {
      return {
        ...state,
        cpZcPurchaseFromList: action.payload,
      };
    },
    cpZcPurchaseFromNotPageList(state, action) {
      return {
        ...state,
        cpZcPurchaseFromNotPageList: action.payload,
      };
    },
    cpZcPurchaseFromTreeDataList(state, action) {
      return {
        ...state,
        cpZcPurchaseFromTreeDataList: action.payload,
      };
    },
    cpZcPurchaseFromGet(state, action) {
      return {
        ...state,
        cpZcPurchaseFromGet: action.payload,
      };
    },
    clear(state) {
      return {
        ...state,
        // cpZcPurchaseFromList: {
        //   list: [],
        //   pagination: {},
        // },
        cpZcPurchaseFromNotPageList: [],
        cpZcPurchaseFromTreeDataList:[],
        cpZcPurchaseFromGet: {},
        // ...state
      }
    }
  },
};


