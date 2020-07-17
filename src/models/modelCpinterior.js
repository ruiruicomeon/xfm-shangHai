import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import { interiordelCpBillSingel,createCpBusinessOrder , listSearchCpBusinessOrderLine, listinterior, addCpinterior, listNotPageinteriorr, deleteinterior, updateinterior, getinterior, listinteriorTreeData, assemblyRevocation } from '../services/api';

export default {
  namespace: 'cpinterior',

  state: {
    cpBusinessOrderList: {
      list: [],
      pagination: {},
    },
    cpBusinessOrderNotPageList: [],
    cpBusinessOrderTreeDataList: [],
    cpBusinessOrderGet: {},
    cpBusinessOrderSearchList: {}
  },

  effects: {
    *interior_del_CpBillSingel({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(interiordelCpBillSingel, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("删除成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("删除失败");
      }
    },


    *createCpBusinessOrder_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(createCpBusinessOrder, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },

    *cpBusinessOrder_SearchList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listSearchCpBusinessOrderLine, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'cpBusinessOrderSearchList',
        payload: dataMSG,
      });
    },
    *cpBusinessOrder_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listinterior, value);
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
        type: 'cpBusinessOrderList',
        payload: dataMSG,
      });
    },
    *cpBusinessOrder_NotPageList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listNotPageinteriorr, value);
      let dataMSG = [];
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = [];
      }
      yield put({
        type: 'cpBusinessOrderNotPageList',
        payload: dataMSG,
      });
    },
    *cpBusinessOrder_TreeData({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listinteriorTreeData, value);
      let dataMSG = [];
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = [];
      }
      yield put({
        type: 'cpBusinessOrderTreeDataList',
        payload: dataMSG,
      });
    },
    *cpBusinessOrder_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpinterior, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *cpBusinessOrder_Revocation({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(assemblyRevocation, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("撤销成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("撤销失败");
      }
    },
    *cpBusinessOrder_Update({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(updateinterior, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("修改成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("修改失败");
      }
    },
    *cpBusinessOrder_Get({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getinterior, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpBusinessOrderGet',
        payload: response.data,
      });
    },
    *cpBusinessOrder_Delete({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deleteinterior, value);
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
    cpBusinessOrderSearchList(state, action) {
      return {
        ...state,
        cpBusinessOrderSearchList: action.payload,
      };
    },
    cpBusinessOrderList(state, action) {
      return {
        ...state,
        cpBusinessOrderList: action.payload,
      };
    },
    cpBusinessOrderNotPageList(state, action) {
      return {
        ...state,
        cpBusinessOrderNotPageList: action.payload,
      };
    },
    cpBusinessOrderTreeDataList(state, action) {
      return {
        ...state,
        cpBusinessOrderTreeDataList: action.payload,
      };
    },
    cpBusinessOrderGet(state, action) {
      return {
        ...state,
        cpBusinessOrderGet: action.payload,
      };
    },
    clear(state) {
      return {
        ...state,
        // cpBusinessOrderList: {
        //   list: [],
        //   pagination: {},
        // },
        cpBusinessOrderNotPageList: [],
        cpBusinessOrderTreeDataList: [],
        cpBusinessOrderGet: {},
        // ...state
      }
    }
  },
};

