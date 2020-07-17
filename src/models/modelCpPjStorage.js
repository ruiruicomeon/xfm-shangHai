import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import { listCpPjStorage, addCpPjStorage , deleteCpPjStorage , getCpPjStorage  } from '../services/api';

export default {
  namespace: 'cpPjStorage',

  state: {
    cpPjStorageList: {
      list: [],
      pagination: {},
    },
    cpPjStorageNotPageList: [],
    cpPjStorageTreeDataList:[],
    cpPjStorageGet: {}
  },

  effects: {
    *cpPjStorage_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpPjStorage, value);
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
        type: 'cpPjStorageList',
        payload: dataMSG,
      });
    },

    *cpPjStorage_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpPjStorage, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *cpPjStorage_Get({ payload, callback }, { call, put }) {
    const value = jsonToFormData(payload);
      const response = yield call(getCpPjStorage, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpPjStorageGet',
        payload: response.data,
      });
    },
    *cpPjStorage_Delete({ payload, callback }, { call }) {
    const value = jsonToFormData(payload);
      const response = yield call(deleteCpPjStorage, value);
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
    cpPjStorageList(state, action) {
      return {
        ...state,
        cpPjStorageList: action.payload,
      };
    },
    cpPjStorageNotPageList(state, action) {
      return {
        ...state,
        cpPjStorageNotPageList: action.payload,
      };
    },
    cpPjStorageTreeDataList(state, action) {
      return {
        ...state,
        cpPjStorageTreeDataList: action.payload,
      };
    },
    cpPjStorageGet(state, action) {
      return {
        ...state,
        cpPjStorageGet: action.payload,
      };
    },
    clear(state) {
      return {
        ...state,
        // cpPjStorageList: {
        //   list: [],
        //   pagination: {},
        // },
        cpPjStorageNotPageList: [],
        cpPjStorageTreeDataList:[],
        cpPjStorageGet: {},
      }
    }
  },
};


