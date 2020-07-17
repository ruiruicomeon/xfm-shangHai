import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import { getCpSupplierLine, listCpSupplier, addCpSupplier , deleteCpSupplier , getCpSupplier  } from '../services/api';

export default {
  namespace: 'cpSupplier',

  state: {
    cpSupplierList: {
      list: [],
      pagination: {},
    },
    cpSupplierNotPageList: [],
    cpSupplierTreeDataList:[],
    cpSupplierGet: {},
    CpSupplierSearchList:{}
  },

  effects: {
    *CpSupplier_SearchList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpSupplierLine, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'CpSupplierSearchList',
        payload: dataMSG,
      });
    },


    *cpSupplier_List({ payload ,callback}, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpSupplier, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if(callback) callback()
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'cpSupplierList',
        payload: dataMSG,
      });
    },
    *cpSupplier_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpSupplier, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("操作成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("操作失败");
      }
    },
    *cpSupplier_Get({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpSupplier, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpSupplierGet',
        payload: response.data,
      });
    },
    *cpSupplier_Delete({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deleteCpSupplier, value);
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
    cpSupplierList(state, action) {
      return {
        ...state,
        cpSupplierList: action.payload,
      };
    },
    cpSupplierNotPageList(state, action) {
      return {
        ...state,
        cpSupplierNotPageList: action.payload,
      };
    },
    cpSupplierTreeDataList(state, action) {
      return {
        ...state,
        cpSupplierTreeDataList: action.payload,
      };
    },
    cpSupplierGet(state, action) {
      return {
        ...state,
        cpSupplierGet: action.payload,
      };
    },
    CpSupplierSearchList(state, action) {
      return {
        ...state,
        CpSupplierSearchList: action.payload,
      };
    },
    clear(state) {
      return {
        ...state,
        // CpSupplierSearchList:{
        //   list: [],
        //   pagination: {},
        // },
        // cpSupplierList: {
        //   list: [],
        //   pagination: {},
        // },
        cpSupplierNotPageList: [],
        cpSupplierTreeDataList:[],
        cpSupplierGet: {},
      }
    }
  },
};

