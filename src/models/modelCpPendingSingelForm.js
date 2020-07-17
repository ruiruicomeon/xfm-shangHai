import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import {cpPendingSingelFormsave, cpPendingSingelFormresubmit, cpPendingSingelFormisPass, cpBillSingelSave, cpPendingSingeldel , getcpPendingSingelFormLine , listCpPendingSingelForm, addCpPendingSingelForm, listNotPageCpPendingSingelForm, deleteCpPendingSingelForm, updateCpPendingSingelForm, getCpPendingSingelForm, listCpPendingSingelFormTreeData } from '../services/api';
export default {
  namespace: 'cpPendingSingelForm',

  state: {
    PendingSingelFormList: {
      list: [],
      pagination: {},
    },
    cpPendingSingelFormNotPageList: [],
    cpPendingSingelFormTreeDataList:[],
    cpPendingSingelFormGet: {},
    cpPendingSingelSearchList:{}
  },

  effects: {
    *cpPendingSingelForm_Save1({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpPendingSingelFormsave, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("修改成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("修改失败");
      }
    },


    *cpPendingSingelForm_respost({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpPendingSingelFormresubmit, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("操作成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("操作失败");
      }
    },


    *cpPendingSingelForm_isPass({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpPendingSingelFormisPass, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("操作成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("操作失败");
      }
    },

    *cpBillSingel_Save({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpBillSingelSave, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("保存成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("保存失败");
      }
    },

    *cpPendingSingel_del({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpPendingSingeldel, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("删除成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("删除失败");
      }
    },

    *cpPendingSingel_SearchList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getcpPendingSingelFormLine, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'cpPendingSingelSearchList',
        payload: dataMSG,
      });
    },

    *cpPendingSingelForm_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpPendingSingelForm, value);
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
        type: 'PendingSingelFormList',
        payload: dataMSG,
      });
    },
    *cpPendingSingelForm_NotPageList({ payload }, { call, put }) {
     const value = jsonToFormData(payload);
      const response = yield call(listNotPageCpPendingSingelForm, value);
      let dataMSG = [];
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = [];
      }
      yield put({
        type: 'cpPendingSingelFormNotPageList',
        payload: dataMSG,
      });
    },
    *cpPendingSingelForm_TreeData({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpPendingSingelFormTreeData, value);
      let dataMSG = [];
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = [];
      }
      yield put({
        type: 'cpPendingSingelFormTreeDataList',
        payload: dataMSG,
      });
    },
    *cpPendingSingelForm_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpPendingSingelForm, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *cpPendingSingelForm_Update({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(updateCpPendingSingelForm, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("修改成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("修改失败");
      }
    },
    *cpPendingSingelForm_Get({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpPendingSingelForm, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpPendingSingelFormGet',
        payload: response.data,
      });
    },
    *cpPendingSingelForm_Delete({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deleteCpPendingSingelForm, value);
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
    PendingSingelFormList(state, action) {
      return {
        ...state,
        PendingSingelFormList: action.payload,
      };
    },
    cpPendingSingelFormNotPageList(state, action) {
      return {
        ...state,
        cpPendingSingelFormNotPageList: action.payload,
      };
    },
    cpPendingSingelFormTreeDataList(state, action) {
      return {
        ...state,
        cpPendingSingelFormTreeDataList: action.payload,
      };
    },
    cpPendingSingelFormGet(state, action) {
      return {
        ...state,
        cpPendingSingelFormGet: action.payload,
      };
    },
    cpPendingSingelSearchList(state, action) {
      return {
        ...state,
        cpPendingSingelSearchList: action.payload,
      };
    },
    clear(state) {
      return {
        ...state,
        // cpPendingSingelFormList: {
        //   list: [],
        //   pagination: {},
        // },
        cpPendingSingelFormNotPageList: [],
        cpPendingSingelFormTreeDataList:[],
        cpPendingSingelFormGet: {},
        // cpPendingSingelSearchList:{}
        // ...state
      }
    }
  },
};
