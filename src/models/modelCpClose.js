import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import { listCpClose, addCpClose , deleteCpClose , getCpClose } from '../services/api';

export default {
  namespace: 'cpClose',

  state: {
    cpCloseList: {
      list: [],
      pagination: {},
    },
    cpCloseNotPageList: [],
    cpCloseTreeDataList:[],
    cpCloseGet: {}
  },

  effects: {
    *cpClose_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpClose, value);
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
        type: 'cpCloseList',
        payload: dataMSG,
      });
    },
    *cpClose_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpClose, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *cpClose_Get({ payload, callback }, { call, put }) {
    const value = jsonToFormData(payload);
      const response = yield call(getCpClose, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpCloseGet',
        payload: response.data,
      });
    },
    *cpClose_Delete({ payload, callback }, { call }) {
    const value = jsonToFormData(payload);
      const response = yield call(deleteCpClose, value);
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
    cpCloseList(state, action) {
      return {
        ...state,
        cpCloseList: action.payload,
      };
    },
    cpCloseNotPageList(state, action) {
      return {
        ...state,
        cpCloseNotPageList: action.payload,
      };
    },
    cpCloseTreeDataList(state, action) {
      return {
        ...state,
        cpCloseTreeDataList: action.payload,
      };
    },
    cpCloseGet(state, action) {
      return {
        ...state,
        cpCloseGet: action.payload,
      };
    },
    clear() {
      return {
        cpCloseList: {
          list: [],
          pagination: {},
        },
        cpCloseNotPageList: [],
        cpCloseTreeDataList:[],
        cpCloseGet: {},
      }
    }
  },
};

