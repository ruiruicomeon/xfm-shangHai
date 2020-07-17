import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import {cpMoneyChangeAuditresubmit, cpMoneyChangeAuditisPass, postCpMoneyChangeAuditsave, postCpMoneyChangeAuditsubmit,listCpMoneyChangeAudit, addCpMoneyChangeAudit , deleteCpMoneyChangeAudit , getCpMoneyChangeAudit } from '../services/api';

export default {
  namespace: 'cpMoneyChangeAudit',

  state: {
    cpMoneyChangeAuditList: {
      list: [],
      pagination: {},
    },
    cpMoneyChangeAuditNotPageList: [],
    cpMoneyChangeAuditTreeDataList:[],
    cpMoneyChangeAuditGet: {}
  },

  effects: {

    *cpMoneyChangeAudit_resubmit({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpMoneyChangeAuditresubmit, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("操作成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("操作失败");
      }
    },

    *cpMoneyChangeAudit_save({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(postCpMoneyChangeAuditsave, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("保存成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("保存失败");
      }
    },
    *cpMoneyChangeAudit_submit({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(postCpMoneyChangeAuditsubmit, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("提交成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("提交失败");
      }
    },

    *cpMoneyChangeAudit_isPass({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpMoneyChangeAuditisPass, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("操作成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("操作失败");
      }
    },

    *cpMoneyChangeAudit_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpMoneyChangeAudit, value);
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
        type: 'cpMoneyChangeAuditList',
        payload: dataMSG,
      });
    },
    *cpMoneyChangeAudit_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpMoneyChangeAudit, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *cpMoneyChangeAudit_Get({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpMoneyChangeAudit, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpMoneyChangeAuditGet',
        payload: response.data,
      });
    },
    *cpMoneyChangeAudit_Delete({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deleteCpMoneyChangeAudit, value);
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
    cpMoneyChangeAuditList(state, action) {
      return {
        ...state,
        cpMoneyChangeAuditList: action.payload,
      };
    },
    cpMoneyChangeAuditNotPageList(state, action) {
      return {
        ...state,
        cpMoneyChangeAuditNotPageList: action.payload,
      };
    },
    cpMoneyChangeAuditTreeDataList(state, action) {
      return {
        ...state,
        cpMoneyChangeAuditTreeDataList: action.payload,
      };
    },
    cpMoneyChangeAuditGet(state, action) {
      return {
        ...state,
        cpMoneyChangeAuditGet: action.payload,
      };
    },
    clear(state) {
      return {
        cpMoneyChangeAuditList: {
          list: [],
          pagination: {},
        },
        cpMoneyChangeAuditNotPageList: [],
        cpMoneyChangeAuditTreeDataList:[],
        cpMoneyChangeAuditGet: {},
        ...state
      }
    }
  },
};


