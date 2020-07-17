import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import {
  cpAfterSgFromrevocation, cpAfterJaFromrevocation, cpPlantSceneFromRevocation, cpCostFormRevocation, cpQuitFromRevocation,
  cpProductQuitFromRevocation, cpOutProductRevocation, cpProductSalesFromRevocation, cpProductRevocation, cpZcPurchaseFromRevocation,
  cpMoneyChangeAuditRevocation, cpMoneyChangeRevocation, cpOutStorageFromRevocation, cpAccessoriesAllotRevocation,
  cpOutSalesFromRevocation, cpPurchaseFromRevocation, cpInStorageFromRevocation,
  getCpAfterEntrustFromLine, getCpMoneyChangeLine, getCpMoneyChangeAuditLine, getCpAfterSgFromLine, getCpAfterJaFromLine, getCpPurchaseFromLine
  , getCpPurchaseStockPendingLine, getCpInStorageFromLine, getCpOutSalesFromLine, getCpOutboundLine, getCpOutStorageFromLine,
  getCpQuitFromLine, getCpZcPurchaseFromLine, getCpProductLine, getCpProductSalesFromLine, getCpOutProductLine
  , getCpProductQuitFromLine, getCpCostFormLine, getCpPlantSceneFromLine, getCpSupplierAuditLine, cpPendingSingelFormrevocation,
  undoCpAssembly, undoInventory, cpInvoiceDetailrevocation, cpDischargedFormRevocation, getStatisticsDetailLine, getTotalStatementLine,
  getCpMaterialPurchaseLine, getStayMarketFromLine
} from '../services/api';

export default {
  namespace: 'cpRevocation',

  state: {
    CpAfterEntrustFromSearchList: {},
    CpMoneyChangeSearchList: {},
    CpMoneyChangeAuditSearchList: {},
    CpAfterJaFromSearchList: {},
    getCpAfterSgFromSearchList: {},
    CpPurchaseFromSearchList: {},
    CpPurchaseStockPendingSearchList: {},
    CpInStorageFromSearchList: {},
    CpOutSalesFromSearchList: {},
    CpOutboundearchList: {},
    CpOutStorageFromSearchList: {},
    CpQuitFromSearchList: {},
    CpZcPurchaseFromSearchList: {},
    CpProductSearchList: {},
    CpProductSalesFromSearchList: {},
    CpOutProductSearchList: {},
    CpProductQuitFromSearchList: {},
    CpCostFormSearchList: {},
    CpPlantSceneFromSearchList: {},
    CpSupplierAuditSearchList: {},
    getStatisticsDetailLine: {},
    getTotalStatementLine: {},
    CpMaterialPurchaseLine: {},
    StayMarketFromLine: {}
  },

  effects: {

    *get_TotalStatementLine({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getTotalStatementLine, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'getTotalStatementLine',
        payload: dataMSG,
      });
    },

    *get_StatisticsDetailLine({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getStatisticsDetailLine, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'getStatisticsDetailLine',
        payload: dataMSG,
      });
    },

    *CpSupplierAudit_SearchList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpSupplierAuditLine, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'CpSupplierAuditSearchList',
        payload: dataMSG,
      });
    },

    *CpPlantSceneFrom_SearchList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpPlantSceneFromLine, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'CpPlantSceneFromSearchList',
        payload: dataMSG,
      });
    },

    *CpCostForm_SearchList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpCostFormLine, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'CpCostFormSearchList',
        payload: dataMSG,
      });
    },

    *CpProductQuitFrom_SearchList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpProductQuitFromLine, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'CpProductQuitFromSearchList',
        payload: dataMSG,
      });
    },

    *CpOutProduct_SearchList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpOutProductLine, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'CpOutProductSearchList',
        payload: dataMSG,
      });
    },

    *CpProductSalesFrom_SearchList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpProductSalesFromLine, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'CpProductSalesFromSearchList',
        payload: dataMSG,
      });
    },

    *CpProduct_SearchList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpProductLine, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'CpProductSearchList',
        payload: dataMSG,
      });
    },

    *CpZcPurchaseFrom_SearchList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpZcPurchaseFromLine, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'CpZcPurchaseFromSearchList',
        payload: dataMSG,
      });
    },

    *CpQuitFrom_SearchList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpQuitFromLine, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'CpQuitFromSearchList',
        payload: dataMSG,
      });
    },

    *CpOutStorageFrom_SearchList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpOutStorageFromLine, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'CpOutStorageFromSearchList',
        payload: dataMSG,
      });
    },

    *CpOutbound_SearchList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpOutboundLine, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'CpOutboundearchList',
        payload: dataMSG,
      });
    },

    *CpOutSalesFrom_SearchList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpOutSalesFromLine, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'CpOutSalesFromSearchList',
        payload: dataMSG,
      });
    },

    *CpInStorageFrom_SearchList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpInStorageFromLine, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'CpInStorageFromSearchList',
        payload: dataMSG,
      });
    },

    *CpPurchaseStockPending_SearchList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpPurchaseStockPendingLine, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'CpPurchaseStockPendingSearchList',
        payload: dataMSG,
      });
    },

    *getStayMarketFrom_Line({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getStayMarketFromLine, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'StayMarketFromLine',
        payload: dataMSG,
      });
    },

    *getCpMaterial_PurchaseLine({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpMaterialPurchaseLine, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'CpMaterialPurchaseLine',
        payload: dataMSG,
      });
    },

    *CpPurchaseFrom_SearchList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpPurchaseFromLine, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'CpPurchaseFromSearchList',
        payload: dataMSG,
      });
    },

    *CpAfterJaFrom_SearchList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpAfterJaFromLine, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'CpAfterJaFromSearchList',
        payload: dataMSG,
      });
    },

    *CpAfterSgFrom_SearchList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpAfterSgFromLine, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'getCpAfterSgFromSearchList',
        payload: dataMSG,
      });
    },

    *CpMoneyChangeAudit_SearchList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpMoneyChangeAuditLine, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'CpMoneyChangeAuditSearchList',
        payload: dataMSG,
      });
    },

    *CpMoneyChange_SearchList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpMoneyChangeLine, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'CpMoneyChangeSearchList',
        payload: dataMSG,
      });
    },

    *CpAfterEntrustFrom_SearchList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpAfterEntrustFromLine, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'CpAfterEntrustFromSearchList',
        payload: dataMSG,
      });
    },


    *cpProductQuitFrom_Revocation({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpProductQuitFromRevocation, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("撤销成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("撤销失败");
      }
    },

    *cpDischargedForm_Revocation({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpDischargedFormRevocation, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("撤销成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("撤销失败");
      }
    },

    *cpOutProduct_Revocation({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpOutProductRevocation, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("撤销成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("撤销失败");
      }
    },

    *cpProductSalesFrom_Revocation({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpProductSalesFromRevocation, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("撤销成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("撤销失败");
      }
    },

    *cpProduct_Revocation({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpProductRevocation, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("撤销成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("撤销失败");
      }
    },


    *cpZcPurchaseFrom_Revocation({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpZcPurchaseFromRevocation, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("撤销成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("撤销失败");
      }
    },

    *cpMoneyChangeAudit_Revocation({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpMoneyChangeAuditRevocation, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("撤销成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("撤销失败");
      }
    },


    *cpMoneyChange_Revocation({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpMoneyChangeRevocation, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("撤销成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("撤销失败");
      }
    },


    *cpOutStorageFrom_Revocation({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpOutStorageFromRevocation, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("撤销成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("撤销失败");
      }
    },


    *cpInvoiceDetail_revocation({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpInvoiceDetailrevocation, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("撤销成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("撤销失败");
      }
    },

    *cpAccessoriesAllot_Revocation({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpAccessoriesAllotRevocation, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("撤销成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("撤销失败");
      }
    },

    *cpOutSalesFrom_Revocation({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpOutSalesFromRevocation, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("撤销成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("撤销失败");
      }
    },

    *cpPurchaseFrom_Revocation({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpPurchaseFromRevocation, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("撤销成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("撤销失败");
      }
    },

    *cpInStorageFrom_Revocation({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpInStorageFromRevocation, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("撤销成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("撤销失败");
      }
    },

    *undo_CpAssembly({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(undoCpAssembly, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("撤销成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("撤销失败");
      }
    },

    *undo_Inventory({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(undoInventory, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("撤销成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("撤销失败");
      }
    },





    *cpPendingSingelForm_revocation({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpPendingSingelFormrevocation, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("撤销成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("撤销失败");
      }
    },


    *cpQuitFrom_Revocation({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpQuitFromRevocation, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("撤销成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("撤销失败");
      }
    },

    *cpCostForm_Revocation({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpCostFormRevocation, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("撤销成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("撤销失败");
      }
    },

    *cpPlantSceneFrom_Revocation({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpPlantSceneFromRevocation, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("撤销成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("撤销失败");
      }
    },

    *cpAfterSgFrom_revocation({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpAfterSgFromrevocation, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("撤销成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("撤销失败");
      }
    },

    *cpAfterJaFrom_revocation({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpAfterJaFromrevocation, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("撤销成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("撤销失败");
      }
    },
    // *cpBusinessIntention_undo({ payload, callback }, { call }) {
    //   const value = jsonToFormData(payload);
    //   const response = yield call(undoBusinessIntention, value);
    //   if (isNotBlank(response) && response.success === '1') {
    //     message.success("撤销成功");
    //     if (callback) callback();
    //   } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
    //     message.error(response.msg);
    //   } else {
    //     message.error("撤销失败");
    //   }
    // },
  },
  reducers: {
    CpAfterEntrustFromSearchList(state, action) {
      return {
        ...state,
        CpAfterEntrustFromSearchList: action.payload,
      };
    },
    CpMoneyChangeSearchList(state, action) {
      return {
        ...state,
        CpMoneyChangeSearchList: action.payload,
      }
    },
    CpMoneyChangeAuditSearchList(state, action) {
      return {
        ...state,
        CpMoneyChangeAuditSearchList: action.payload,
      }
    },
    getCpAfterSgFromSearchList(state, action) {
      return {
        ...state,
        getCpAfterSgFromSearchList: action.payload,
      }
    },
    CpAfterJaFromSearchList(state, action) {
      return {
        ...state,
        CpAfterJaFromSearchList: action.payload,
      }
    },
    CpPurchaseFromSearchList(state, action) {
      return {
        ...state,
        CpPurchaseFromSearchList: action.payload,
      }
    },
    CpPurchaseStockPendingSearchList(state, action) {
      return {
        ...state,
        CpPurchaseStockPendingSearchList: action.payload,
      }
    },
    CpMaterialPurchaseLine(state, action) {
      return {
        ...state,
        CpMaterialPurchaseLine: action.payload,
      }
    },
    CpInStorageFromSearchList(state, action) {
      return {
        ...state,
        CpInStorageFromSearchList: action.payload,
      }
    },
    CpOutSalesFromSearchList(state, action) {
      return {
        ...state,
        CpOutSalesFromSearchList: action.payload,
      }
    },
    CpOutboundearchList(state, action) {
      return {
        ...state,
        CpOutboundearchList: action.payload,
      }
    },
    CpOutStorageFromSearchList(state, action) {
      return {
        ...state,
        CpOutStorageFromSearchList: action.payload,
      }
    },
    CpQuitFromSearchList(state, action) {
      return {
        ...state,
        CpQuitFromSearchList: action.payload,
      }
    },
    CpZcPurchaseFromSearchList(state, action) {
      return {
        ...state,
        CpZcPurchaseFromSearchList: action.payload,
      }
    },
    CpProductSearchList(state, action) {
      return {
        ...state,
        CpProductSearchList: action.payload,
      }
    },
    CpProductSalesFromSearchList(state, action) {
      return {
        ...state,
        CpProductSalesFromSearchList: action.payload,
      }
    },
    CpOutProductSearchList(state, action) {
      return {
        ...state,
        CpOutProductSearchList: action.payload,
      }
    },
    CpProductQuitFromSearchList(state, action) {
      return {
        ...state,
        CpProductQuitFromSearchList: action.payload,
      }
    },
    CpCostFormSearchList(state, action) {
      return {
        ...state,
        CpCostFormSearchList: action.payload,
      }
    },
    CpPlantSceneFromSearchList(state, action) {
      return {
        ...state,
        CpPlantSceneFromSearchList: action.payload,
      }
    },
    CpSupplierAuditSearchList(state, action) {
      return {
        ...state,
        CpSupplierAuditSearchList: action.payload,
      }
    },
    getStatisticsDetailLine(state, action) {
      return {
        ...state,
        getStatisticsDetailLine: action.payload,
      }
    },
    getTotalStatementLine(state, action) {
      return {
        ...state,
        getTotalStatementLine: action.payload,
      }
    },
    StayMarketFromLine(state, action) {
      return {
        ...state,
        StayMarketFromLine: action.payload,
      }
    },

    clear(state) {
      return {
        ...state
        // CpSupplierAuditSearchList:{},
        // CpPlantSceneFromSearchList:{},
        // CpCostFormSearchList:{},
        // CpProductQuitFromSearchList:{},
        // CpOutProductSearchList:{},
        // CpProductSalesFromSearchList:{},
        // CpAfterEntrustFromSearchList: {},
        // CpMoneyChangeSearchList:{},
        // CpMoneyChangeAuditSearchList:{},
        // getCpAfterSgFromSearchList:{},
        // CpAfterJaFromSearchList:{},
        // CpPurchaseFromSearchList:{},
        // CpPurchaseStockPendingSearchList:{},
        // CpInStorageFromSearchList:{},
        // CpOutSalesFromSearchList:{},
        // CpOutboundearchList:{},
        // CpOutStorageFromSearchList:{},
        // CpQuitFromSearchList:{},
        // CpZcPurchaseFromSearchList:{},
        // CpProductSearchList:{}
      }
    }
  },
};


