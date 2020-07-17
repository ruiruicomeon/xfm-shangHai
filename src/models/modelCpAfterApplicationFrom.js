import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import {cpAfterApplicationFromHistory, getCpAfterApplicationFromLine, cpAfterApplicationisPass, cpAfterApplicationResubmit, cpAfterApplicationRevocation , saveCpAfterApplication, selectComplete , listCpAfterApplicationFrom, addCpAfterApplicationFrom , deleteCpAfterApplicationFrom, getCpAfterApplicationFrom ,
  cpAfterApplicationFromHistoryupdate,saveCpAfterApplicationFromHistory,addCpAfterApplicationFromHistory,
  deleteCpAfterApplicationFromHistory,getCpAfterApplicationFromHistory,CpAfterApplicationFromHistoryLine,
  CpAfterApplicationFromHistoryRevocation,CpAfterApplicationFromHistoryResubmit,CpAfterApplicationFromHistoryisPass,ApplicationFrogetCpOfferForm} from '../services/api';

export default {
  namespace: 'cpAfterApplicationFrom',

  state: {
    cpAfterApplicationFromList: {
      list: [],
      pagination: {},
    },
    selectCompleteList: {
      list: [],
      pagination: {},
    },
    cpAfterApplicationFromHistory:{
      list: [],
      pagination: {},
    },
    cpAfterApplicationFromNotPageList: [],
    cpAfterApplicationFromTreeDataList:[],
    cpAfterApplicationFromGet: {},
    CpAfterApplicationFromHistoryGet:{},
    CpAfterApplicationSearchList:{},
    CpAfterApplicationFromHistorySearchList:{}
  },

  effects: {

    *ApplicationFro_getCpOfferForm({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(ApplicationFrogetCpOfferForm, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response.data);
      }
      yield put({
        type: 'ApplicationFrogetCpOfferFormGet',
        payload: response.data,
      });
    },

    *add_CpAfterApplicationFromHistory({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpAfterApplicationFromHistory, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },

    *save_CpAfterApplicationFromHistory({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(saveCpAfterApplicationFromHistory, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("保存成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("保存失败");
      }
    },
    *get_CpAfterApplicationFromHistory({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpAfterApplicationFromHistory, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'CpAfterApplicationFromHistoryGet',
        payload: response.data,
      });
    },
    *delete_CpAfterApplicationFromHistory({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deleteCpAfterApplicationFromHistory, value);
      if (isNotBlank(response) && (response.success === '1' || response.success === 1)) {
        message.success("删除成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0)) {
        message.error("删除失败");
      }
    },


    *CpAfter_ApplicationFrom_HistoryLine({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(CpAfterApplicationFromHistoryLine, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'CpAfterApplicationFromHistorySearchList',
        payload: dataMSG,
      });
    },


    *CpAfter_ApplicationFromHistory_isPass({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(CpAfterApplicationFromHistoryisPass, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("操作成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("操作失败");
      }
    },

    *CpAfter_ApplicationFromHistory_Resubmit({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(CpAfterApplicationFromHistoryResubmit, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("撤回成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("撤回失败");
      }
    },

    *CpAfter_ApplicationFromHistory_Revocation({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(CpAfterApplicationFromHistoryRevocation, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("撤销成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("撤销失败");
      }
    },




    *cpAfterApplicationFrom_History({ payload ,callback}, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpAfterApplicationFromHistory, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if(callback)  callback(response.data)
      } else { 
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'cpAfterApplicationFromHistory',
        payload: dataMSG,
      });
    },

    *CpAfterApplication_SearchList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpAfterApplicationFromLine, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'CpAfterApplicationSearchList',
        payload: dataMSG,
      });
    },


    *cpAfter_Application_ispass({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpAfterApplicationisPass, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("操作成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("操作失败");
      }
    },

    *cpAfterApplication_Resubmit({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpAfterApplicationResubmit, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("撤回成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("撤回失败");
      }
    },

    *cpAfterApplication_Revocation({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpAfterApplicationRevocation, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("撤销成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("撤销失败");
      }
    },

    *select_complete_List({ payload ,callback}, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(selectComplete, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if(callback)  callback(response.data)
      } else { 
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'selectCompleteList',
        payload: dataMSG,
      });
    },

    *cpAfterApplicationFrom_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpAfterApplicationFrom, value);
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
        type: 'cpAfterApplicationFromList',
        payload: dataMSG,
      });
    },
    *cpAfterApplicationFrom_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpAfterApplicationFrom, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },

    *cpAfterApplicationFrom_save({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(saveCpAfterApplication, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("保存成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("保存失败");
      }
    },
    *cpAfterApplicationFrom_Get({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpAfterApplicationFrom, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpAfterApplicationFromGet',
        payload: response.data,
      });
    },
    *cpAfterApplicationFrom_Delete({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deleteCpAfterApplicationFrom, value);
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
    cpAfterApplicationFromList(state, action) {
      return {
        ...state,
        cpAfterApplicationFromList: action.payload,
      };
    },
    cpAfterApplicationFromNotPageList(state, action) {
      return {
        ...state,
        cpAfterApplicationFromNotPageList: action.payload,
      };
    },
    cpAfterApplicationFromTreeDataList(state, action) {
      return {
        ...state,
        cpAfterApplicationFromTreeDataList: action.payload,
      };
    },
    cpAfterApplicationFromGet(state, action) {
      return {
        ...state,
        cpAfterApplicationFromGet: action.payload,
      };
  
    },
    selectCompleteList(state, action) {
        return {
          ...state,
          selectCompleteList: action.payload,
        }
      },
      CpAfterApplicationSearchList(state, action) {
        return {
          ...state,
          CpAfterApplicationSearchList: action.payload,
        }
      },
      cpAfterApplicationFromHistory(state, action) {
        return {
          ...state,
          cpAfterApplicationFromHistory: action.payload,
        }
      },
      CpAfterApplicationFromHistorySearchList(state, action) {
        return {
          ...state,
          CpAfterApplicationFromHistorySearchList: action.payload,
        }
      },
      CpAfterApplicationFromHistoryGet(state, action) {
        return {
          ...state,
          CpAfterApplicationFromHistoryGet: action.payload,
        }
      },
    clear(state) {
      return {
        ...state,
        CpAfterApplicationFromHistoryGet:{},
        // cpAfterApplicationFromHistory:{
        //   list: [],
        //   pagination: {},
        // },
        selectCompleteList:{
          list: [],
          pagination: {},
        },
        // cpAfterApplicationFromList: {
          
        // },
        cpAfterApplicationFromNotPageList: [],
        cpAfterApplicationFromTreeDataList:[],
        cpAfterApplicationFromGet: {},
        // ...state
        // CpAfterApplicationSearchList:{},
        // CpAfterApplicationFromHistorySearchList:{}

      }
    }
  },
};
