import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import { getQrCpPurchaseStockPendingList, listCpPurchaseFrom, addCpPurchaseFrom , deleteCpPurchaseFrom , getCpPurchaseFrom  } from '../services/api';

export default {
  namespace: 'cpPurchaseFrom',

  state: {
    cpPurchaseFromList: {
      list: [],
      pagination: {},
    },
    cpPurchaseFromNotPageList: [],
    cpPurchaseFromTreeDataList:[],
    cpPurchaseFromGet: {}
  },

  effects: {
    *get_QrCpPurchaseStockPending_List({ payload ,callback}, { call, put }) {
      const value = jsonToFormData(payload);
       const response = yield call(getQrCpPurchaseStockPendingList, value);
      //  let dataMSG = [];
       if (isNotBlank(response) && isNotBlank(response.data)) {
        //  dataMSG = response.data;
         if(callback) callback(response)
       } else {
        //  dataMSG = [];
       }
      //  yield put({
      //    type: 'cpPurchaseFromNotPageList',
      //    payload: dataMSG,
      //  });
     },


    *cpPurchaseFrom_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpPurchaseFrom, value);
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
        type: 'cpPurchaseFromList',
        payload: dataMSG,
      });
    },
    *cpPurchaseFrom_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpPurchaseFrom, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *cpPurchaseFrom_Get({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpPurchaseFrom, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpPurchaseFromGet',
        payload: response.data,
      });
    },

    *cpPurchaseFrom_print_Get({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpPurchaseFrom, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
    },

    *cpPurchaseFrom_Delete({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deleteCpPurchaseFrom, value);
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
    cpPurchaseFromList(state, action) {
      return {
        ...state,
        cpPurchaseFromList: action.payload,
      };
    },
    cpPurchaseFromNotPageList(state, action) {
      return {
        ...state,
        cpPurchaseFromNotPageList: action.payload,
      };
    },
    cpPurchaseFromTreeDataList(state, action) {
      return {
        ...state,
        cpPurchaseFromTreeDataList: action.payload,
      };
    },
    cpPurchaseFromGet(state, action) {
      return {
        ...state,
        cpPurchaseFromGet: action.payload,
      };
    },
    clear(state) {
      return {
        ...state,
        // cpPurchaseFromList: {
        //   list: [],
        //   pagination: {},
        // },
        cpPurchaseFromNotPageList: [],
        cpPurchaseFromTreeDataList:[],
        cpPurchaseFromGet: {},
      }
    }
  },
};

