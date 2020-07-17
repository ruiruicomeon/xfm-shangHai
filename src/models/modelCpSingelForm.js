import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import { getCpSingelFormLine , getCpSingelFormRevocation , postCpSingelForm , cpSingelFormisPass , CpSingelFormResubmit , CpSingelFormSave, listCpSingelForm, addCpSingelForm , deleteCpSingelForm , getCpSingelForm } from '../services/api';

export default {
  namespace: 'cpSingelForm',

  state: {
    cpSingelFormList: {
      list: [],
      pagination: {},
    },
    cpSingelFormNotPageList: [],
    cpSingelFormTreeDataList:[],
    cpSingelFormGet: {},
    CpSingelFormSearchList:{}
  },

  effects: {
    *CpSingelForm_SearchList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpSingelFormLine, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'CpSingelFormSearchList',
        payload: dataMSG,
      });
    },


    *CpSingelForm_Revocation({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpSingelFormRevocation, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("撤销成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("撤销失败");
      }
    },


    *CpSingelForm_post({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(postCpSingelForm, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("报价成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("报价失败");
      }
    },
    
    *cpSingel_settlement_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpSingelFormisPass, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("操作成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("操作失败");
      }
    },

    *cpSingelForm_Save({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(CpSingelFormSave, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("保存成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("保存失败");
      }
    },

    *cpSingelForm_Resubmit({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(CpSingelFormResubmit, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("操作成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("操作失败");
      }
    },


    *cpSingelForm_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpSingelForm, value);
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
        type: 'cpSingelFormList',
        payload: dataMSG,
      });
    },
    *cpSingelForm_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpSingelForm, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *cpSingelForm_Get({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpSingelForm, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpSingelFormGet',
        payload: response.data,
      });
    },

    *cpSingelForm_print_Get({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpSingelForm, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
    },

    *cpSingelForm_Delete({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deleteCpSingelForm, value);
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
    cpSingelFormList(state, action) {
      return {
        ...state,
        cpSingelFormList: action.payload,
      };
    },
    cpSingelFormNotPageList(state, action) {
      return {
        ...state,
        cpSingelFormNotPageList: action.payload,
      };
    },
    cpSingelFormTreeDataList(state, action) {
      return {
        ...state,
        cpSingelFormTreeDataList: action.payload,
      };
    },
    cpSingelFormGet(state, action) {
      return {
        ...state,
        cpSingelFormGet: action.payload,
      };
    },
    CpSingelFormSearchList(state, action) {
      return {
        ...state,
        CpSingelFormSearchList: action.payload,
      };
    },
    clear(state) {
      return {
        ...state,
        // cpSingelFormList: {
        //   list: [],
        //   pagination: {},
        // },
        cpSingelFormNotPageList: [],
        cpSingelFormTreeDataList:[],
        cpSingelFormGet: {},
        // CpSingelFormSearchList:{},
        // ...state
      }
    }
  },
};

