import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import { listCpStorage, addCpStorage , deleteCpStorage , getCpStorage } from '../services/api';

export default {
  namespace: 'cpStorage',

  state: {
    cpStorageList: {
      list: [],
      pagination: {},
    },
    cpStorageNotPageList: [],
    cpStorageTreeDataList:[],
    cpStorageGet: {}
  },

  effects: {
    *cpStorage_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpStorage, value);
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
        type: 'cpStorageList',
        payload: dataMSG,
      });
    },
    *cpStorage_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpStorage, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *cpStorage_Get({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpStorage, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpStorageGet',
        payload: response.data,
      });
    },
    *cpStorage_Delete({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deleteCpStorage, value);
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
    cpStorageList(state, action) {
      return {
        ...state,
        cpStorageList: action.payload,
      };
    },
    cpStorageNotPageList(state, action) {
      return {
        ...state,
        cpStorageNotPageList: action.payload,
      };
    },
    cpStorageTreeDataList(state, action) {
      return {
        ...state,
        cpStorageTreeDataList: action.payload,
      };
    },
    cpStorageGet(state, action) {
      return {
        ...state,
        cpStorageGet: action.payload,
      };
    },
    clear(state) {
      return {
        ...state,
        // cpStorageList: {
        //   list: [],
        //   pagination: {},
        // },
        cpStorageNotPageList: [],
        cpStorageTreeDataList:[],
        cpStorageGet: {},
        // ...state
      }
    }
  },
};

