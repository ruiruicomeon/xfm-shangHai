import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import {updateCpStartInvoice, getCpStartInvoiceLine, getIssueCpStartInvoiceList,getalreadyCpStartInvoiceList,getexitCpStartInvoiceList, cpInvoiceDetailresubmit, cpInvoiceDetailisPass , postCpStartInvoice, cpStartInvoiceticket,cpStartInvoicecompletion,selectOfffrom, listCpStartInvoice, addCpStartInvoice , deleteCpStartInvoice , getCpStartInvoice,
    listCpInvoiceDetail ,addCpInvoiceDetail ,deleteCpInvoiceDetail,postCFDetail ,getCpInvoiceDetailListNoPage ,getCpStartInvoiceListCpcliect} from '../services/api';

export default {
  namespace: 'cpStartInvoice',

  state: {
    cpStartInvoiceList: {
      list: [],
      pagination: {},
    },
    getexitCpStartInvoiceList:{
      list: [],
      pagination: {},
    },
    getIssueCpStartInvoiceList:{
      list: [],
      pagination: {},
    },
    getalreadyCpStartInvoiceList:{
      list: [],
      pagination: {},
    },
    cpInvoiceDetailList:[],
    // cpInvoiceDetailList: {
    //   list: [],
    //   pagination: {},
    // },
    cpStartInvoiceNotPageList: {
      list: [],
      pagination: {},
    },
    getCpStartInvoiceListCpcliect: {
      list: [],
      pagination: {},
    },
    cpStartInvoiceTreeDataList:[],
    cpStartInvoiceGet: {},
    getCpStartInvoiceLine:{}
  },

  effects: {

    *update_CpStartInvoice({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(updateCpStartInvoice, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("提交成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("提交失败");
      }
    },

    *get_CpStartInvoiceLine({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpStartInvoiceLine, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'getCpStartInvoiceLine',
        payload: dataMSG,
      });
    },

    *get_CpStartInvoiceListCpcliect({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpStartInvoiceListCpcliect, value);
      let dataMSG =  {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'getCpStartInvoiceListCpcliect',
        payload: dataMSG,
      });
    },


    *get_CpInvoiceDetailListNoPage({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpInvoiceDetailListNoPage, value);
      let dataMSG =  {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'cpStartInvoiceNotPageList',
        payload: dataMSG,
      });
    },

    *get_exitCpStartInvoice_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getexitCpStartInvoiceList, value);
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
        type: 'getexitCpStartInvoiceList',
        payload: dataMSG,
      });
    },

    *get_alreadyCpStartInvoice_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getalreadyCpStartInvoiceList, value);
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
        type: 'getalreadyCpStartInvoiceList',
        payload: dataMSG,
      });
    },

    *get_IssueCpStartInvoice_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getIssueCpStartInvoiceList, value);
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
        type: 'getIssueCpStartInvoiceList',
        payload: dataMSG,
      });
    },


    *cpInvoiceDetail_resubmit({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpInvoiceDetailresubmit, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("操作成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("操作失败");
      }
    },


    *cpInvoiceDetail_isPass({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpInvoiceDetailisPass, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("操作成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("操作失败");
      }
    },

    *post_CpStartInvoice({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(postCpStartInvoice, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("提交成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("提交失败");
      }
    },
    
    *cpStartInvoice_ticket({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpStartInvoiceticket, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("退票申请成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("退票申请失败");
      }
    },

    *cpStartInvoice_completion({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpStartInvoicecompletion, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("提交成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("提交失败");
      }
    },

    *select_Offfrom({ payload ,callback}, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(selectOfffrom, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback(response.data)
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'selectofffrom',
        payload: dataMSG,
      });
    },


    *postCF_Detail({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(postCFDetail, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },


    *cpInvoiceDetail_List({ payload ,callback}, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpInvoiceDetail, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.success==1)) {
        dataMSG = isNotBlank(response.data)?response.data:[];
        if(callback) callback(isNotBlank(response.data)?response.data:[])
      } else {
        dataMSG = []
        // dataMSG = {
        //   list: [],
        //   pagination: {},
        // };
      }
      yield put({
        type: 'cpInvoiceDetailList',
        payload: dataMSG,
      });
    },
    *cpInvoiceDetail_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpInvoiceDetail, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *cpInvoiceDetail_Delete({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
        const response = yield call(deleteCpInvoiceDetail, value);
        if (isNotBlank(response) && (response.success === '1' || response.success === 1)) {
          message.success("删除成功");
          if (callback) callback();
        } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
          message.error(response.msg);
        } else if (isNotBlank(response) && (response.success === '0' || response.success === 0)) {
          message.error("删除失败");
        }
      },

    *cpStartInvoice_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpStartInvoice, value);
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
        type: 'cpStartInvoiceList',
        payload: dataMSG,
      });
    },
    *cpStartInvoice_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpStartInvoice, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *cpStartInvoice_Get({ payload, callback }, { call, put }) {
    const value = jsonToFormData(payload);
      const response = yield call(getCpStartInvoice, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpStartInvoiceGet',
        payload: response.data,
      });
    },
    *cpStartInvoice_Delete({ payload, callback }, { call }) {
    const value = jsonToFormData(payload);
      const response = yield call(deleteCpStartInvoice, value);
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
    cpInvoiceDetailList(state, action) {
      return {
        ...state,
        cpInvoiceDetailList: action.payload,
      };
    },
    cpStartInvoiceList(state, action) {
      return {
        ...state,
        cpStartInvoiceList: action.payload,
      };
    },
    cpStartInvoiceNotPageList(state, action) {
      return {
        ...state,
        cpStartInvoiceNotPageList: action.payload,
      };
    },
    cpStartInvoiceTreeDataList(state, action) {
      return {
        ...state,
        cpStartInvoiceTreeDataList: action.payload,
      };
    },
    cpStartInvoiceGet(state, action) {
      return {
        ...state,
        cpStartInvoiceGet: action.payload,
      };
    },
    getalreadyCpStartInvoiceList(state, action) {
      return {
        ...state,
        getalreadyCpStartInvoiceList: action.payload,
      };
    },
    getIssueCpStartInvoiceList(state, action) {
      return {
        ...state,
        getIssueCpStartInvoiceList: action.payload,
      };
    },
    getexitCpStartInvoiceList(state, action) {
      return {
        ...state,
        getexitCpStartInvoiceList: action.payload,
      };
    },
    getCpStartInvoiceListCpcliect(state, action) {
      return {
        ...state,
        getCpStartInvoiceListCpcliect: action.payload,
      };
    },
    getCpStartInvoiceLine(state, action) {
      return {
        ...state,
        getCpStartInvoiceLine: action.payload,
      };
    },
    clear(state) {
      
      return {
        ...state,
        // getCpStartInvoiceLine:{},
        getCpStartInvoiceListCpcliect:{
          list: [],
          pagination: {},
        },
        // getexitCpStartInvoiceList:{
        //   list: [],
        //   pagination: {},
        // },
        // getIssueCpStartInvoiceList:{
        //   list: [],
        //   pagination: {},
        // },
        // getalreadyCpStartInvoiceList:{
        //   list: [],
        //   pagination: {},
        // },
        // cpStartInvoiceList: {
        //   list: [],
        //   pagination: {},
        // },
        cpInvoiceDetailList:[],
        // cpInvoiceDetailList: {
        //   list: [],
        //   pagination: {},
        // },
        cpStartInvoiceNotPageList: {
          list: [],
          pagination: {},
        },
        cpStartInvoiceTreeDataList:[],
        cpStartInvoiceGet: {},
      }
    }
  },
};


