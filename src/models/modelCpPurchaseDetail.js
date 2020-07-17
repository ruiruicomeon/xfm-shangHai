import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import { cpAccessoriesdelete, updatePJFromDetail , selectDetail , getzcByBill, deleteQuitFromDetail, getByBill, lastCpPurchaseDetail, 
  cpOutStorageDeleteStorage ,updateOutFromDetail , listCpPurchaseDetail, addCpPurchaseDetail , deleteCpPurchaseDetail, updateCpPurchaseDetail, 
  getCpPurchaseDetail ,getOutBoundDetailLine} from '../services/api';

export default {
  namespace: 'cpPurchaseDetail',

  state: {
    cpPurchaseDetailList: {
      list: [],
      pagination: {},
    },
    cpPurchaseDetailModalList:{
      list: [],
      pagination: {},
    },
    getByBillList:{
      list: [],
      pagination: {},
    },
    getzcByBilllist:{
      list: [],
      pagination: {},
    },
    cpPurchaseDetailNotPageList: [],
    cpPurchaseDetailTreeDataList:[],
    cpPurchaseDetailGet: {},
    selectDetail:{},
    getOutBoundDetailLine:{
      list: [],
      pagination: {},
    }
  },

  effects: {

    *cpAccessories_delete({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpAccessoriesdelete, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("删除成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("删除失败");
      }
    },

    *update_PJ_FromDetail({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(updatePJFromDetail, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },

    *select_Detail({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(selectDetail, value);
      if (isNotBlank(response) && response.success === '1') {
        if (callback) callback(response.data);
      }
    },

    *get_zcBy_Bill({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getzcByBill, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = {
          list:response.data
        }
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'getzcByBilllist',
        payload: dataMSG,
      });
    },


    *getBy_Bill({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getByBill, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = {
          list:response.data
        }
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'getByBillList',
        payload: dataMSG,
      });
    },


    *last_Cp_PurchaseDetail({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(lastCpPurchaseDetail, value);
      if (isNotBlank(response) && response.success === '1') {
        if (callback) callback(response.data);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("查询失败");
      }
    },

    *update_out_from_detail({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(updateOutFromDetail, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("修改成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("修改失败");
      }
    },

      *delete_Quit_From_Detail({ payload, callback }, { call }) {
        const value = jsonToFormData(payload);
        const response = yield call(deleteQuitFromDetail, value);
        if (isNotBlank(response) && response.success === '1') {
          message.success("删除成功");
          if (callback) callback();
        } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
          message.error(response.msg);
        } else {
          message.error("删除失败");
        }
      },

    *cpOutStorage_delete_storage({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpOutStorageDeleteStorage, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("删除成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("删除失败");
      }
    },

    
    *getOutBoundDetail_Line({ payload ,callback}, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getOutBoundDetailLine, value);
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
        type: 'getOutBoundDetailLine',
        payload: dataMSG,
      });
    },

    *cpPurchaseDetail_List({ payload ,callback}, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpPurchaseDetail, value);
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
        type: 'cpPurchaseDetailList',
        payload: dataMSG,
      });
    },

    *cpPurchaseDetail_modal_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpPurchaseDetail, value);
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
        type: 'cpPurchaseDetailModalList',
        payload: dataMSG,
      });
    },
    *cpPurchaseDetail_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpPurchaseDetail, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *cpPurchaseDetail_Update({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(updateCpPurchaseDetail, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("修改成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("修改失败");
      }
    },
    *cpPurchaseDetail_Get({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpPurchaseDetail, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpPurchaseDetailGet',
        payload: response.data,
      });
    },
    *cpPurchaseDetail_Delete({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deleteCpPurchaseDetail, value);
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
    cpPurchaseDetailModalList(state, action){
      return {
        ...state,
        cpPurchaseDetailModalList: action.payload,
      };
    },
    cpPurchaseDetailList(state, action) {
      return {
        ...state,
        cpPurchaseDetailList: action.payload,
      };
    },
    cpPurchaseDetailNotPageList(state, action) {
      return {
        ...state,
        cpPurchaseDetailNotPageList: action.payload,
      };
    },
    cpPurchaseDetailTreeDataList(state, action) {
      return {
        ...state,
        cpPurchaseDetailTreeDataList: action.payload,
      };
    },
    cpPurchaseDetailGet(state, action) {
      return {
        ...state,
        cpPurchaseDetailGet: action.payload,
      };
    },
    getByBillList(state, action) {
      return {
        ...state,
        getByBillList: action.payload,
      };
    },
    getzcByBilllist(state, action) {
      return {
        ...state,
        getzcByBilllist: action.payload,
      };
    },
    selectDetail(state, action) {
      return {
        ...state,
        selectDetail: action.payload,
      };
    },
    getOutBoundDetailLine(state, action) {
      return {
        ...state,
        getOutBoundDetailLine: action.payload,
      };
    },
    clear() {
      return {
        selectDetail:{},
        getOutBoundDetailLine:{
          list: [],
        pagination: {},
        },
        getzcByBilllist:{
          list: [],
        pagination: {},
        },
        getByBillList:{
          list: [],
          pagination: {},
        },
        cpPurchaseDetailModalList:{
          list: [],
          pagination: {},
        },
        cpPurchaseDetailList: {
          list: [],
          pagination: {},
        },
        cpPurchaseDetailNotPageList: [],
        cpPurchaseDetailTreeDataList:[],
        cpPurchaseDetailGet: {},
      }
    }
  },
};
