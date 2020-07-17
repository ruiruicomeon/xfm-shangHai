import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import {getCpOfferFormChane , cpMoneyChangeresubmit , getCpAccessoriesSalesFormAll , postCpMoneyChangesave , postCpMoneyChangesubmit, cpMoneyChangeisPass , listCpMoneyChange, addCpMoneyChange , deleteCpMoneyChange , getCpMoneyChange } from '../services/api';

export default {
  namespace: 'cpMoneyChange',

  state: {
    cpMoneyChangeList: {
      list: [],
      pagination: {},
    },
    cpMoneyChangeNotPageList: [],
    cpMoneyChangeTreeDataList:[],
    cpMoneyChangeGet: {},
    getCpAccessoriesSaleslist:{
      list: [],
      pagination: {},
    }
  },

  effects: {
    *get_cpOfferForm_Chane({ payload ,callback}, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpOfferFormChane, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if(callback) callback(response.data)
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'getCpOfferFormChane',
        payload: dataMSG,
      });
    },

    *cpMoneyChange_resubmit({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpMoneyChangeresubmit, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("重新提交成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("重新提交失败");
      }
    },

    *get_CpAccessories_SalesFormAll({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpAccessoriesSalesFormAll, value);
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
        type: 'getCpAccessoriesSaleslist',
        payload: dataMSG,
      });
    },


    *cpMoneyChange_save({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(postCpMoneyChangesave, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("保存成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("保存失败");
      }
    },
    *cpMoneyChange_submit({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(postCpMoneyChangesubmit, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("提交成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("提交失败");
      }
    },

    *cp_Money_Change_isPass({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpMoneyChangeisPass, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("操作成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("操作失败");
      }
    },


    *cpMoneyChange_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpMoneyChange, value);
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
        type: 'cpMoneyChangeList',
        payload: dataMSG,
      });
    },
    *cpMoneyChange_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpMoneyChange, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *cpMoneyChange_Get({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpMoneyChange, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpMoneyChangeGet',
        payload: response.data,
      });
    },
    *cpMoneyChange_Delete({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deleteCpMoneyChange, value);
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
    cpMoneyChangeList(state, action) {
      return {
        ...state,
        cpMoneyChangeList: action.payload,
      };
    },
    cpMoneyChangeNotPageList(state, action) {
      return {
        ...state,
        cpMoneyChangeNotPageList: action.payload,
      };
    },
    cpMoneyChangeTreeDataList(state, action) {
      return {
        ...state,
        cpMoneyChangeTreeDataList: action.payload,
      };
    },
    getCpAccessoriesSaleslist(state, action) {
      return {
        ...state,
        getCpAccessoriesSaleslist: action.payload,
      };
    },
    cpMoneyChangeGet(state, action) {
      return {
        ...state,
        cpMoneyChangeGet: action.payload,
      };
    },
    clear(state) {
      return {
        ...state,
        // cpMoneyChangeList: {
        //   list: [],
        //   pagination: {},
        // },
        getCpAccessoriesSaleslist: {
          list: [],
          pagination: {},
        },
        cpMoneyChangeNotPageList: [],
        cpMoneyChangeTreeDataList:[],
        cpMoneyChangeGet: {},
        // ...state
      }
    }
  },
};

