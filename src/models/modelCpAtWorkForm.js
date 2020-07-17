import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import {listSearchCpAtWorkFormLine, cpAtWorkFormRevocation,listCpAtWorkForm, addCpAtWorkForm , deleteCpAtWorkForm , getCpAtWorkForm  } from '../services/api';

export default {
  namespace: 'cpAtWorkForm',

  state: {
    cpAtWorkFormList: {
      list: [],
      pagination: {},
    },
    cpAtWorkFormNotPageList: [],
    cpAtWorkFormTreeDataList:[],
    cpAtWorkFormGet: {},
    cpAtWorkFormSearchList: {},
  },

  effects: {

    *cpAtWorkForm_SearchList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listSearchCpAtWorkFormLine, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'cpAtWorkFormSearchList',
        payload: dataMSG,
      });
    },

    *cpAtWorkForm_Revocation({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpAtWorkFormRevocation, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("撤销成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("撤销失败");
      }
    },

    *cpAtWorkForm_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpAtWorkForm, value);
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
        type: 'cpAtWorkFormList',
        payload: dataMSG,
      });
    },
    *cpAtWorkForm_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpAtWorkForm, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *cpAtWorkForm_Get({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpAtWorkForm, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpAtWorkFormGet',
        payload: response.data,
      });
    },
    *cpAtWorkForm_Delete({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deleteCpAtWorkForm, value);
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
    cpAtWorkFormList(state, action) {
      return {
        ...state,
        cpAtWorkFormList: action.payload,
      };
    },
    cpAtWorkFormNotPageList(state, action) {
      return {
        ...state,
        cpAtWorkFormNotPageList: action.payload,
      };
    },
    cpAtWorkFormTreeDataList(state, action) {
      return {
        ...state,
        cpAtWorkFormTreeDataList: action.payload,
      };
    },
    cpAtWorkFormGet(state, action) {
      return {
        ...state,
        cpAtWorkFormGet: action.payload,
      };
    }, 
    cpAtWorkFormSearchList(state, action) {
      return {
        ...state,
        cpAtWorkFormSearchList: action.payload,
      };
    },
    clear(state) {
      return {
        ...state,
        // cpAtWorkFormList: {
        //   list: [],
        //   pagination: {},
        // },
        cpAtWorkFormNotPageList: [],
        cpAtWorkFormTreeDataList:[],
        cpAtWorkFormGet: {},
        // cpAtWorkFormSearchList:{},
        // ...state
      }
    }
  },
};
