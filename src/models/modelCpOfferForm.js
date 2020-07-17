import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import {cpOfferFormrevocationJS, updateCpBillSingel , jscpOfferFormrevocation , updateCpOfferForm, getCpOfferFormLine , cpOfferFormRevocation, cpOfferFormonsave, isPass,postCpOfferDetail,getCpOfferDetailList,deleteCpOfferDetail, listCpOfferForm, addCpOfferForm , deleteCpOfferForm, getCpOfferForm  } from '../services/api';

export default {
  namespace: 'cpOfferForm',
  
  state: {
    cpOfferFormList: {
      list: [],
      pagination: {},
    },
    cpOfferDetailList:{
      list: [],
      pagination: {},
    },
    cpSettlementList:{
      list: [],
      pagination: {},
    },
    cpOfferFormNotPageList: [],
    cpOfferFormTreeDataList:[],
    cpOfferFormGet: {},
    cpOfferSearchList:{}
  },

  effects: {

    *cpOfferForm_revocationJS({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpOfferFormrevocationJS, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("撤销成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("撤销失败");
      }
    },
    
    *update_CpBill_Singel({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(updateCpBillSingel, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("操作成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("操作失败");
      }
    },

    *jscpOfferForm_revocation({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(jscpOfferFormrevocation, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("撤销成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("撤销失败");
      }
    },

    *CpOffer_SearchList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpOfferFormLine, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'cpOfferSearchList',
        payload: dataMSG,
      });
    },

    *cpOffer_respost({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpOfferFormRevocation, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("操作成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("操作失败");
      }
    },

    *cpOffer_Detail_List({ payload ,callback}, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpOfferDetailList, value);
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
        type: 'cpOfferDetailList',
        payload: dataMSG,
      });
    },

    *cpOffer_save_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpOfferFormonsave, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("保存成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("保存失败");
      }
    },

    *cpOffer_Detail_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(postCpOfferDetail, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },

    *cpOffer_settlement_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(isPass, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("操作成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("操作失败");
      }
    },

    *cpOffer_Detail_Delete({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deleteCpOfferDetail, value);
      if (isNotBlank(response) && (response.success === '1' || response.success === 1)) {
        message.success("删除成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0)) {
        message.error("删除失败");
      }
    },

    *cpOfferForm_List({ payload ,callback}, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpOfferForm, value);
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
        type: 'cpOfferFormList',
        payload: dataMSG,
      });
    },

    *cpSettlement_List({ payload ,callback}, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpOfferForm, value);
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
        type: 'cpSettlementList',
        payload: dataMSG,
      });
    },

    *update_CpOfferForm({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(updateCpOfferForm, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },

    *cpOfferForm_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpOfferForm, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },

    // *cpOfferForm_Update({ payload, callback }, { call }) {
    //   const value = jsonToFormData(payload);
    //   const response = yield call(updateCpOfferForm, value);
    //   if (isNotBlank(response) && response.success === '1') {
    //     message.success("修改成功");
    //     if (callback) callback();
    //   } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
    //     message.error(response.msg);
    //   } else {
    //     message.error("修改失败");
    //   }
    // },
    *cpOfferForm_Get({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpOfferForm, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpOfferFormGet',
        payload: response.data,
      });
    },
    *cpOfferForm_Delete({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deleteCpOfferForm, value);
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
    cpOfferFormList(state, action) {
      return {
        ...state,
        cpOfferFormList: action.payload,
      };
    },
    cpOfferFormNotPageList(state, action) {
      return {
        ...state,
        cpOfferFormNotPageList: action.payload,
      };
    },
    cpOfferFormTreeDataList(state, action) {
      return {
        ...state,
        cpOfferFormTreeDataList: action.payload,
      };
    },
    cpOfferDetailList(state, action) {
      return {
        ...state,
        cpOfferDetailList: action.payload,
      };
    },
    cpOfferFormGet(state, action) {
      return {
        ...state,
        cpOfferFormGet: action.payload,
      };
    },
    cpOfferSearchList(state, action) {
      return {
        ...state,
        cpOfferSearchList: action.payload,
      };
    },
    cpSettlementList(state, action) {
      return {
        ...state,
        cpSettlementList: action.payload,
      };
    },
    clear(state) {
      return {
        ...state,
        // cpOfferFormList: {
        //   list: [],
        //   pagination: {},
        // },
        cpOfferDetailList:{
          list: [],
          pagination: {},
        },
        // cpOfferSearchList:{},
        cpOfferFormNotPageList: [],
        cpOfferFormTreeDataList:[],
        cpOfferFormGet: {},
        // ...state
      }
    }
  },
};

