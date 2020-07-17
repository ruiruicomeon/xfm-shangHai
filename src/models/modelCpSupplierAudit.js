import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import {cpSupplierAuditresubmit, cpSupplierAuditispass,cpSupplierAuditsave  , listCpSupplierAudit, addCpSupplierAudit , deleteCpSupplierAudit, getCpSupplierAudit  } from '../services/api';

export default {
  namespace: 'cpSupplierAudit',

  state: {
    cpSupplierAuditList: {
      list: [],
      pagination: {},
    },
    cpSupplierAuditNotPageList: [],
    cpSupplierAuditTreeDataList:[],
    cpSupplierAuditGet: {}
  },

  effects: {

    *cpSupplierAudit_resubmit({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpSupplierAuditresubmit, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("操作成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("操作失败");
      }
    },


    *cpSupplierAudit_save({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpSupplierAuditsave, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("保存成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("保存失败");
      }
    },

    *cpSupplierAudit_pass({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpSupplierAuditispass, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("操作成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("操作失败");
      }
    },

    *cpSupplierAudit_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpSupplierAudit, value);
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
        type: 'cpSupplierAuditList',
        payload: dataMSG,
      });
    },
    *cpSupplierAudit_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpSupplierAudit, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *cpSupplierAudit_Get({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpSupplierAudit, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpSupplierAuditGet',
        payload: response.data,
      });
    },
    *cpSupplierAudit_Delete({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deleteCpSupplierAudit, value);
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
    cpSupplierAuditList(state, action) {
      return {
        ...state,
        cpSupplierAuditList: action.payload,
      };
    },
    cpSupplierAuditNotPageList(state, action) {
      return {
        ...state,
        cpSupplierAuditNotPageList: action.payload,
      };
    },
    cpSupplierAuditTreeDataList(state, action) {
      return {
        ...state,
        cpSupplierAuditTreeDataList: action.payload,
      };
    },
    cpSupplierAuditGet(state, action) {
      return {
        ...state,
        cpSupplierAuditGet: action.payload,
      };
    },
    clear(state) {
      return {
        ...state,
        // cpSupplierAuditList: {
        //   list: [],
        //   pagination: {},
        // },
        cpSupplierAuditNotPageList: [],
        cpSupplierAuditTreeDataList:[],
        cpSupplierAuditGet: {},
      }
    }
  },
};
