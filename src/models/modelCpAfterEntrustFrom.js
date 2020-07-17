import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import {cpAfterEntrustisPass, cpAfterEntrustRevocation, listCpAfterEntrustFrom, addCpAfterEntrustFrom , deleteCpAfterEntrustFrom , getCpAfterEntrustFrom } from '../services/api';

export default {
  namespace: 'cpAfterEntrustFrom',

  state: {
    cpAfterEntrustFromList: {
      list: [],
      pagination: {},
    },
    cpAfterEntrustFromNotPageList: [],
    cpAfterEntrustFromTreeDataList:[],
    cpAfterEntrustFromGet: {}
  },

  effects: {

    *cpAfter_Entrust_isPass({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpAfterEntrustisPass, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("操作成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("操作失败");
      }
    },

    *cpAfterEntrust_Revocation({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpAfterEntrustRevocation, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("撤销成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("撤销失败");
      }
    },

    *cpAfterEntrustFrom_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpAfterEntrustFrom, value);
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
        type: 'cpAfterEntrustFromList',
        payload: dataMSG,
      });
    },
    *cpAfterEntrustFrom_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpAfterEntrustFrom, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *cpAfterEntrustFrom_Get({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpAfterEntrustFrom, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpAfterEntrustFromGet',
        payload: response.data,
      });
    },
    *cpAfterEntrustFrom_Delete({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deleteCpAfterEntrustFrom, value);
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
    cpAfterEntrustFromList(state, action) {
      return {
        ...state,
        cpAfterEntrustFromList: action.payload,
      };
    },
    cpAfterEntrustFromNotPageList(state, action) {
      return {
        ...state,
        cpAfterEntrustFromNotPageList: action.payload,
      };
    },
    cpAfterEntrustFromTreeDataList(state, action) {
      return {
        ...state,
        cpAfterEntrustFromTreeDataList: action.payload,
      };
    },
    cpAfterEntrustFromGet(state, action) {
      return {
        ...state,
        cpAfterEntrustFromGet: action.payload,
      };
    },
    clear(state) {
      return {
        ...state,
        // cpAfterEntrustFromList: {
        //   list: [],
        //   pagination: {},
        // },
        cpAfterEntrustFromNotPageList: [],
        cpAfterEntrustFromTreeDataList:[],
        cpAfterEntrustFromGet: {},
      }
    }
  },
};

