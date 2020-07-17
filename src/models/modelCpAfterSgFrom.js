import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import { listCpAfterSgFrom, addCpAfterSgFrom , deleteCpAfterSgFrom , getCpAfterSgFrom } from '../services/api';

export default {
  namespace: 'cpAfterSgFrom',

  state: {
    cpAfterSgFromList: {
      list: [],
      pagination: {},
    },
    cpAfterSgFromNotPageList: [],
    cpAfterSgFromTreeDataList:[],
    cpAfterSgFromGet: {}
  },

  effects: {
    *cpAfterSgFrom_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpAfterSgFrom, value);
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
        type: 'cpAfterSgFromList',
        payload: dataMSG,
      });
    },
    *cpAfterSgFrom_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpAfterSgFrom, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *cpAfterSgFrom_Get({ payload, callback }, { call, put }) {
    const value = jsonToFormData(payload);
      const response = yield call(getCpAfterSgFrom, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpAfterSgFromGet',
        payload: response.data,
      });
    },
    *cpAfterSgFrom_Delete({ payload, callback }, { call }) {
    const value = jsonToFormData(payload);
      const response = yield call(deleteCpAfterSgFrom, value);
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
    cpAfterSgFromList(state, action) {
      return {
        ...state,
        cpAfterSgFromList: action.payload,
      };
    },
    cpAfterSgFromNotPageList(state, action) {
      return {
        ...state,
        cpAfterSgFromNotPageList: action.payload,
      };
    },
    cpAfterSgFromTreeDataList(state, action) {
      return {
        ...state,
        cpAfterSgFromTreeDataList: action.payload,
      };
    },
    cpAfterSgFromGet(state, action) {
      return {
        ...state,
        cpAfterSgFromGet: action.payload,
      };
    },
    clear(state) {
      return {
        ...state,
        // cpAfterSgFromList: {
        //   list: [],
        //   pagination: {},
        // },
        cpAfterSgFromNotPageList: [],
        cpAfterSgFromTreeDataList:[],
        cpAfterSgFromGet: {},
        // ...state
      }
    }
  },
};

