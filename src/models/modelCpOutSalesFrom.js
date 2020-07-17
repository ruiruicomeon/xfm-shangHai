import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import { cpOutSalesCreatePurchase , listCpOutSalesFrom, addCpOutSalesFrom , deleteCpOutSalesFrom , getCpOutSalesFrom ,deleteCpOutSalesFromDetail } from '../services/api';

export default {
  namespace: 'cpOutSalesFrom',

  state: {
    cpOutSalesFromList: {
      list: [],
      pagination: {},
    },
    cpOutSalesFromNotPageList: [],
    cpOutSalesFromTreeDataList:[],
    cpOutSalesFromGet: {}
  },

  effects: {

    *delete_CpOutSalesFromDetail({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deleteCpOutSalesFromDetail, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("删除成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("删除失败");
      }
    },

    *cpOutSales_create_purchase({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpOutSalesCreatePurchase, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("修改成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("修改失败");
      }
    },

    *cpOutSalesFrom_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpOutSalesFrom, value);
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
        type: 'cpOutSalesFromList',
        payload: dataMSG,
      });
    },
    *cpOutSalesFrom_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpOutSalesFrom, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },

    *cpOutSalesFrom_Get({ payload, callback }, { call, put }) {
    const value = jsonToFormData(payload);
      const response = yield call(getCpOutSalesFrom, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpOutSalesFromGet',
        payload: response.data,
      });
    },
    *cpOutSalesFrom_Delete({ payload, callback }, { call }) {
    const value = jsonToFormData(payload);
      const response = yield call(deleteCpOutSalesFrom, value);
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
    cpOutSalesFromList(state, action) {
      return {
        ...state,
        cpOutSalesFromList: action.payload,
      };
    },
    cpOutSalesFromNotPageList(state, action) {
      return {
        ...state,
        cpOutSalesFromNotPageList: action.payload,
      };
    },
    cpOutSalesFromTreeDataList(state, action) {
      return {
        ...state,
        cpOutSalesFromTreeDataList: action.payload,
      };
    },
    cpOutSalesFromGet(state, action) {
      return {
        ...state,
        cpOutSalesFromGet: action.payload,
      };
    },
    clear(state) {
      return {
        ...state,
        // cpOutSalesFromList: {
        //   list: [],
        //   pagination: {},
        // },
        cpOutSalesFromNotPageList: [],
        cpOutSalesFromTreeDataList:[],
        cpOutSalesFromGet: {},
        // ...state
      }
    }
  },
};

