import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import {  getCpAccessoriesAllotLine,listCpAccessoriesAllot, addCpAccessoriesAllot, deleteCpAccessoriesAllot, getCpAccessoriesAllot } from '../services/api';

export default {
  namespace: 'cpAccessoriesAllot',

  state: {
    cpAccessoriesAllotList: {
      list: [],
      pagination: {},
    },
    cpAccessoriesAllotNotPageList: [],
    cpAccessoriesAllotTreeDataList:[],
    cpAccessoriesAllotGet: {},
    CpAccessoriesAllotSearchList:{}
  },

  effects: {
    *CpAccessoriesAllot_SearchList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpAccessoriesAllotLine, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'CpAccessoriesAllotSearchList',
        payload: dataMSG,
      });
    },


    *cpAccessoriesAllot_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpAccessoriesAllot, value);
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
        type: 'cpAccessoriesAllotList',
        payload: dataMSG,
      });
    },
    *cpAccessoriesAllot_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpAccessoriesAllot, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *cpAccessoriesAllot_Get({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpAccessoriesAllot, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpAccessoriesAllotGet',
        payload: response.data,
      });
    },
    *cpAccessoriesAllot_Delete({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deleteCpAccessoriesAllot, value);
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
    cpAccessoriesAllotList(state, action) {
      return {
        ...state,
        cpAccessoriesAllotList: action.payload,
      };
    },
    cpAccessoriesAllotNotPageList(state, action) {
      return {
        ...state,
        cpAccessoriesAllotNotPageList: action.payload,
      };
    },
    cpAccessoriesAllotTreeDataList(state, action) {
      return {
        ...state,
        cpAccessoriesAllotTreeDataList: action.payload,
      };
    },
    cpAccessoriesAllotGet(state, action) {
      return {
        ...state,
        cpAccessoriesAllotGet: action.payload,
      };
    },
    CpAccessoriesAllotSearchList(state, action) {
      return {
        ...state,
        CpAccessoriesAllotSearchList: action.payload,
      };
    },
    clear(state) {
      return {
        ...state,
        // cpAccessoriesAllotList: {
        //   list: [],
        //   pagination: {},
        // },
        cpAccessoriesAllotNotPageList: [],
        cpAccessoriesAllotTreeDataList:[],
        cpAccessoriesAllotGet: {},
        // CpAccessoriesAllotSearchList:{}
      }
    }
  },
};


