import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import { deleteAccesssoriesSales ,updateAccessoriSales, getCpAccessoriesSalesFormLine , revocationCpAccessoriesSalesForm ,listCpAccessoriesSalesForm, addCpAccessoriesSalesForm , deleteCpAccessoriesSalesForm  , getCpAccessoriesSalesForm } from '../services/api';

export default {
  namespace: 'cpAccessoriesSalesForm',

  state: {
    cpAccessoriesSalesFormList: {
      list: [],
      pagination: {},
    },
    cpAccessoriesSalesFormNotPageList: [],
    cpAccessoriesSalesFormTreeDataList:[],
    cpAccessoriesSalesFormGet: {},
    CpAccessoriesSalesSearchList:{}
  },

  effects: {
    *delete_AccesssoriesSales({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deleteAccesssoriesSales, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("操作成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("操作失败");
      }
    },

    *update_AccessoriSales({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(updateAccessoriSales, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("操作成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("操作失败");
      }
    },

    *cpAssemblyBuild_SearchList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpAccessoriesSalesFormLine, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'CpAccessoriesSalesSearchList',
        payload: dataMSG,
      });
    },

    *CpAccessoriesSalesForm_undo({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(revocationCpAccessoriesSalesForm, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("撤销成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("撤销失败");
      }
    },

    *cpAccessoriesSalesForm_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpAccessoriesSalesForm, value);
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
        type: 'cpAccessoriesSalesFormList',
        payload: dataMSG,
      });
    },
    *cpAccessoriesSalesForm_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpAccessoriesSalesForm, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *cpAccessoriesSalesForm_save_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpAccessoriesSalesForm, value);
      if (isNotBlank(response) && response.success === '1') {
        if (callback) callback();
      } 
    },
    *cpAccessoriesSalesForm_Get({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpAccessoriesSalesForm, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpAccessoriesSalesFormGet',
        payload: response.data,
      });
    },
    *cpAccessoriesSalesForm_Delete({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deleteCpAccessoriesSalesForm, value);
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
    cpAccessoriesSalesFormList(state, action) {
      return {
        ...state,
        cpAccessoriesSalesFormList: action.payload,
      };
    },
    cpAccessoriesSalesFormNotPageList(state, action) {
      return {
        ...state,
        cpAccessoriesSalesFormNotPageList: action.payload,
      };
    },
    cpAccessoriesSalesFormTreeDataList(state, action) {
      return {
        ...state,
        cpAccessoriesSalesFormTreeDataList: action.payload,
      };
    },
    cpAccessoriesSalesFormGet(state, action) {
      return {
        ...state,
        cpAccessoriesSalesFormGet: action.payload,
      };
    },
    CpAccessoriesSalesSearchList(state, action) {
      return {
        ...state,
        CpAccessoriesSalesSearchList: action.payload,
      };
    },
    clear(state) {
      return {
        ...state,
        // cpAccessoriesSalesFormList: {
        //   list: [],
        //   pagination: {},
        // },
        cpAccessoriesSalesFormNotPageList: [],
        cpAccessoriesSalesFormTreeDataList:[],
        cpAccessoriesSalesFormGet: {},
        // ...state
        // CpAccessoriesSalesSearchList:{}
      }
    }
  },
};
