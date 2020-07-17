import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import { listCpProductQuitFrom, addCpProductQuitFrom , deleteCpProductQuitFrom , getCpProductQuitFrom } from '../services/api';

export default {
  namespace: 'cpProductQuitFrom',

  state: {
    cpProductQuitFromList: {
      list: [],
      pagination: {},
    },
    cpProductQuitFromNotPageList: [],
    cpProductQuitFromTreeDataList:[],
    cpProductQuitFromGet: {}
  },

  effects: {
    *cpProductQuitFrom_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpProductQuitFrom, value);
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
        type: 'cpProductQuitFromList',
        payload: dataMSG,
      });
    },
    *cpProductQuitFrom_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpProductQuitFrom, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },

    *cpProductQuitFrom_Get({ payload, callback }, { call, put }) {
    const value = jsonToFormData(payload);
      const response = yield call(getCpProductQuitFrom, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpProductQuitFromGet',
        payload: response.data,
      });
    },
    *cpProductQuitFrom_Delete({ payload, callback }, { call }) {
    const value = jsonToFormData(payload);
      const response = yield call(deleteCpProductQuitFrom, value);
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
    cpProductQuitFromList(state, action) {
      return {
        ...state,
        cpProductQuitFromList: action.payload,
      };
    },
    cpProductQuitFromNotPageList(state, action) {
      return {
        ...state,
        cpProductQuitFromNotPageList: action.payload,
      };
    },
    cpProductQuitFromTreeDataList(state, action) {
      return {
        ...state,
        cpProductQuitFromTreeDataList: action.payload,
      };
    },
    cpProductQuitFromGet(state, action) {
      return {
        ...state,
        cpProductQuitFromGet: action.payload,
      };
    },
    clear(state) {
      return {
        ...state,
        // cpProductQuitFromList: {
        //   list: [],
        //   pagination: {},
        // },
        cpProductQuitFromNotPageList: [],
        cpProductQuitFromTreeDataList:[],
        cpProductQuitFromGet: {},
        // ...state
      }
    }
  },
};



