import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import { createQuitForm, listCpOutStorageFrom, addCpOutStorageFrom , deleteCpOutStorageFrom , getCpOutStorageFrom } from '../services/api';

export default {
  namespace: 'cpOutStorageFrom',

  state: {
    cpOutStorageFromList: {
      list: [],
      pagination: {},
    },
    cpOutStorageFromNotPageList: [],
    cpOutStorageFromTreeDataList:[],
    cpOutStorageFromGet: {}
  },

  effects: {
    *create_quit_form({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(createQuitForm, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("操作成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("操作失败");
      }
    },

    *cpOutStorageFrom_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpOutStorageFrom, value);
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
        type: 'cpOutStorageFromList',
        payload: dataMSG,
      });
    },
    *cpOutStorageFrom_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpOutStorageFrom, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },

    *cpOutStorageFrom_save_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpOutStorageFrom, value);
      if (isNotBlank(response) && response.success === '1') {
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
      }
    },

    *cpOutStorageFrom_Get({ payload, callback }, { call, put }) {
    const value = jsonToFormData(payload);
      const response = yield call(getCpOutStorageFrom, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpOutStorageFromGet',
        payload: response.data,
      });
    },
    *cpOutStorageFrom_Delete({ payload, callback }, { call }) {
    const value = jsonToFormData(payload);
      const response = yield call(deleteCpOutStorageFrom, value);
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
    cpOutStorageFromList(state, action) {
      return {
        ...state,
        cpOutStorageFromList: action.payload,
      };
    },
    cpOutStorageFromNotPageList(state, action) {
      return {
        ...state,
        cpOutStorageFromNotPageList: action.payload,
      };
    },
    cpOutStorageFromTreeDataList(state, action) {
      return {
        ...state,
        cpOutStorageFromTreeDataList: action.payload,
      };
    },
    cpOutStorageFromGet(state, action) {
      return {
        ...state,
        cpOutStorageFromGet: action.payload,
      };
    },
    clear(state) {
      return {
        ...state,
        // cpOutStorageFromList: {
        //   list: [],
        //   pagination: {},
        // },
        cpOutStorageFromNotPageList: [],
        cpOutStorageFromTreeDataList:[],
        cpOutStorageFromGet: {},
        // ...state
      }
    }
  },
};

