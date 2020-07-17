import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import { listCpOneCode, addCpOneCode, deleteCpOneCode , getCpOneCode } from '../services/api';

export default {
  namespace: 'cpOneCode',

  state: {
    cpOneCodeList: {
      list: [],
      pagination: {},
    },
    cpOneCodeNotPageList: [],
    cpOneCodeTreeDataList:[],
    cpOneCodeGet: {}
  },

  effects: {
    *cpOneCode_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpOneCode, value);
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
        type: 'cpOneCodeList',
        payload: dataMSG,
      });
    },
    *cpOneCode_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpOneCode, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *cpOneCode_Get({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpOneCode, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpOneCodeGet',
        payload: response.data,
      });
    },
    *cpOneCode_Delete({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deleteCpOneCode, value);
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
    cpOneCodeList(state, action) {
      return {
        ...state,
        cpOneCodeList: action.payload,
      };
    },
    cpOneCodeNotPageList(state, action) {
      return {
        ...state,
        cpOneCodeNotPageList: action.payload,
      };
    },
    cpOneCodeTreeDataList(state, action) {
      return {
        ...state,
        cpOneCodeTreeDataList: action.payload,
      };
    },
    cpOneCodeGet(state, action) {
      return {
        ...state,
        cpOneCodeGet: action.payload,
      };
    },
    clear() {
      return {
        cpOneCodeList: {
          list: [],
          pagination: {},
        },
        cpOneCodeNotPageList: [],
        cpOneCodeTreeDataList:[],
        cpOneCodeGet: {},
      }
    }
  },
};


