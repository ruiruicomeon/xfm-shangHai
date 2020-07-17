import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import { getCpStayFormLine , listCpStayForm, addCpStayForm , deleteCpStayForm , getCpStayForm  } from '../services/api';

export default {
  namespace: 'cpStayForm',

  state: {
    cpStayFormList: {
      list: [],
      pagination: {},
    },
    cpStayFormNotPageList: [],
    cpStayFormTreeDataList:[],
    cpStayFormGet: {},
    cpStayFormSearchList:{}
  },

  effects: {
    *cpStayForm_SearchList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpStayFormLine, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'cpStayFormSearchList',
        payload: dataMSG,
      });
    },




    *cpStayForm_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpStayForm, value);
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
        type: 'cpStayFormList',
        payload: dataMSG,
      });
    },
    *cpStayForm_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpStayForm, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("操作成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("操作失败");
      }
    },
    *cpStayForm_Get({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpStayForm, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpStayFormGet',
        payload: response.data,
      });
    },
    *cpStayForm_Delete({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deleteCpStayForm, value);
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
    cpStayFormList(state, action) {
      return {
        ...state,
        cpStayFormList: action.payload,
      };
    },
    cpStayFormNotPageList(state, action) {
      return {
        ...state,
        cpStayFormNotPageList: action.payload,
      };
    },
    cpStayFormTreeDataList(state, action) {
      return {
        ...state,
        cpStayFormTreeDataList: action.payload,
      };
    },
    cpStayFormGet(state, action) {
      return {
        ...state,
        cpStayFormGet: action.payload,
      };
    },
    cpStayFormSearchList(state, action) {
      return {
        ...state,
        cpStayFormSearchList: action.payload,
      };
    },
    clear(state) {
      return {
        ...state,
        // cpStayFormList: {
        //   list: [],
        //   pagination: {},
        // },
        cpStayFormNotPageList: [],
        cpStayFormTreeDataList:[],
        cpStayFormGet: {},
        // cpStayFormSearchList:{}
      }
    }
  },
};

