import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import { listCpAfterJaFrom, addCpAfterJaFrom , deleteCpAfterJaFrom , getCpAfterJaFrom } from '../services/api';

export default {
  namespace: 'cpAfterJaFrom',

  state: {
    cpAfterJaFromList: {
      list: [],
      pagination: {},
    },
    cpAfterJaFromNotPageList: [],
    cpAfterJaFromTreeDataList:[],
    cpAfterJaFromGet: {}
  },

  effects: {
    *cpAfterJaFrom_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpAfterJaFrom, value);
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
        type: 'cpAfterJaFromList',
        payload: dataMSG,
      });
    },
    *cpAfterJaFrom_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpAfterJaFrom, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *cpAfterJaFrom_Get({ payload, callback }, { call, put }) {
    const value = jsonToFormData(payload);
      const response = yield call(getCpAfterJaFrom, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpAfterJaFromGet',
        payload: response.data,
      });
    },
    *cpAfterJaFrom_Delete({ payload, callback }, { call }) {
    const value = jsonToFormData(payload);
      const response = yield call(deleteCpAfterJaFrom, value);
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
    cpAfterJaFromList(state, action) {
      return {
        ...state,
        cpAfterJaFromList: action.payload,
      };
    },
    cpAfterJaFromNotPageList(state, action) {
      return {
        ...state,
        cpAfterJaFromNotPageList: action.payload,
      };
    },
    cpAfterJaFromTreeDataList(state, action) {
      return {
        ...state,
        cpAfterJaFromTreeDataList: action.payload,
      };
    },
    cpAfterJaFromGet(state, action) {
      return {
        ...state,
        cpAfterJaFromGet: action.payload,
      };
    },
    clear(state) {
      return {
        ...state,
        // cpAfterJaFromList: {
        //   list: [],
        //   pagination: {},
        // },
        cpAfterJaFromNotPageList: [],
        cpAfterJaFromTreeDataList:[],
        cpAfterJaFromGet: {},
      }
    }
  },
};
