import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import {cpDischargedFormresubmit, cpDischargedFormsave ,cpDischargedFormispass ,listReleaseOrder, deleteReleaseOrder, updateReleaseOrder, getReleaseOrder, getReleaseOrderLine } from '../services/api';

export default {
  namespace: 'releaseOrder',

  state: {
    releaseOrderList: {
      list: [],
      pagination: {},
    },
    releaseOrderGet: {},
    releaseOrderSearchList: {}
  },

  effects: {
  
    *cpDischargedFormre_submit({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpDischargedFormresubmit, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("重新提交成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("重新提交失败");
      }
    },

    *cpDischargedForm_save({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpDischargedFormsave, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("保存成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("保存失败");
      }
    },

    *cpDischargedForm_ispass({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpDischargedFormispass, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("操作成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("操作失败");
      }
    },

    *releaseOrder_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listReleaseOrder, value);
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
        type: 'releaseOrderList',
        payload: dataMSG,
      });
    },
    *releaseOrder_Update({ payload, callback }, { call }) {
      
      const value = jsonToFormData(payload);
      const response = yield call(updateReleaseOrder, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("修改成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("修改失败");
      }
    },
    *releaseOrder_Get({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getReleaseOrder, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'releaseOrderGet',
        payload: response.data,
      });
    },
    *releaseOrder_Delete({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deleteReleaseOrder, value);
      if (isNotBlank(response) && (response.success === '1' || response.success === 1)) {
        message.success("删除成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0)) {
        message.error("删除失败");
      }
    },
    *releaseOrder_SearchList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getReleaseOrderLine, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'releaseOrderSearchList',
        payload: dataMSG,
      });
    },


  },
  reducers: {
    releaseOrderList(state, action) {
      return {
        ...state,
        releaseOrderList: action.payload,
      };
    },
    releaseOrderNotPageList(state, action) {
      return {
        ...state,
        releaseOrderNotPageList: action.payload,
      };
    },
    releaseOrderTreeDataList(state, action) {
      return {
        ...state,
        releaseOrderTreeDataList: action.payload,
      };
    },
    releaseOrderGet(state, action) {
      return {
        ...state,
        releaseOrderGet: action.payload,
      };
    },
    releaseOrderSearchList(state, action) {
      return {
        ...state,
        releaseOrderSearchList: action.payload,
      };
    },
    clear(state) {
      return {
        ...state,
        // releaseOrderList: {
        //   list: [],
        //   pagination: {},
        // },
        releaseOrderGet: {},
      }
    }
  },
};
