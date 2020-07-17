import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import { listCpCollecCode, addCpCollecCode , deleteCpCollecCode , getCpCollecCode } from '../services/api';

export default {
  namespace: 'cpCollecCode',

  state: {
    cpCollecCodeList: {
      list: [],
      pagination: {},
    },
    cpCollecCodeNotPageList: [],
    cpCollecCodeTreeDataList:[],
    cpCollecCodeGet: {}
  },

  effects: {
    *cpCollecCode_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpCollecCode, value);
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
        type: 'cpCollecCodeList',
        payload: dataMSG,
      });
    },
    *cpCollecCode_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpCollecCode, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *cpCollecCode_Get({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpCollecCode, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpCollecCodeGet',
        payload: response.data,
      });
    },
    *cpCollecCode_Delete({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deleteCpCollecCode, value);
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
    cpCollecCodeList(state, action) {
      return {
        ...state,
        cpCollecCodeList: action.payload,
      };
    },
    cpCollecCodeNotPageList(state, action) {
      return {
        ...state,
        cpCollecCodeNotPageList: action.payload,
      };
    },
    cpCollecCodeTreeDataList(state, action) {
      return {
        ...state,
        cpCollecCodeTreeDataList: action.payload,
      };
    },
    cpCollecCodeGet(state, action) {
      return {
        ...state,
        cpCollecCodeGet: action.payload,
      };
    },
    clear(state) {
      return {
        ...state,
        // cpCollecCodeList: {
        //   list: [],
        //   pagination: {},
        // },
        cpCollecCodeNotPageList: [],
        cpCollecCodeTreeDataList:[],
        cpCollecCodeGet: {},
        // ...state
      }
    }
  },
};

