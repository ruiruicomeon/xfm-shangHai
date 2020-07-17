import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import { listCpCostForm, addCpCostForm , deleteCpCostForm , getCpCostForm } from '../services/api';

export default {
  namespace: 'cpCostForm',

  state: {
    cpCostFormList: {
      list: [],
      pagination: {},
    },
    cpCostFormNotPageList: [],
    cpCostFormTreeDataList:[],
    cpCostFormGet: {}
  },

  effects: {
    *cpCostForm_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpCostForm, value);
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
        type: 'cpCostFormList',
        payload: dataMSG,
      });
    },
    *cpCostForm_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpCostForm, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *cpCostForm_Get({ payload, callback }, { call, put }) {
    const value = jsonToFormData(payload);
      const response = yield call(getCpCostForm, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpCostFormGet',
        payload: response.data,
      });
    },
    *cpCostForm_Delete({ payload, callback }, { call }) {
    const value = jsonToFormData(payload);
      const response = yield call(deleteCpCostForm, value);
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
    cpCostFormList(state, action) {
      return {
        ...state,
        cpCostFormList: action.payload,
      };
    },
    cpCostFormNotPageList(state, action) {
      return {
        ...state,
        cpCostFormNotPageList: action.payload,
      };
    },
    cpCostFormTreeDataList(state, action) {
      return {
        ...state,
        cpCostFormTreeDataList: action.payload,
      };
    },
    cpCostFormGet(state, action) {
      return {
        ...state,
        cpCostFormGet: action.payload,
      };
    },
    clear(state) {
      return {
        ...state,
        // cpCostFormList: {
        //   list: [],
        //   pagination: {},
        // },
        cpCostFormNotPageList: [],
        cpCostFormTreeDataList:[],
        cpCostFormGet: {},
        // ...state
      }
    }
  },
};

