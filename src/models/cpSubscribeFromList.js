import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import { listSubscribeFrom, getCpMaterlalPurchaseDetailList  , getCpMaterialPurchase} from '../services/api';

export default {
  namespace: 'cpSubscribeFrom',

  state: {
    CpSubscribeFromList: {
      list: [],
      pagination: {},
    },
    CpMaterlalPurchaseDetailList: {
      list:[],
      pagination:{}
    },
    CpMaterlalPurchaseDetail:{}
  },

  effects: {
    *CpSubscribeFrom_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listSubscribeFrom, value);
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
        type: 'CpSubscribeFromList',
        payload: dataMSG,
      });
    },

    *cpSubscribeFrom_DateilGte({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpMaterialPurchase, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'CpMaterlalPurchaseDetail',
        payload: response.data,
      });
    },

    *cpSubscribeFrom_DateilList({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpMaterlalPurchaseDetailList, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'CpMaterlalPurchaseDetailList',
        payload: response.data,
      });
    },



  },
  reducers: {
    CpSubscribeFromList(state, action) {
      return {
        ...state,
        CpSubscribeFromList: action.payload,
      };
    },
    CpMaterlalPurchaseDetailList(state, action) {
      return {
        ...state,
        CpMaterlalPurchaseDetailList: action.payload,
      };
    },
    CpMaterlalPurchaseDetail(state, action) {
      return {
        ...state,
        CpMaterlalPurchaseDetail: action.payload,
      };
    },
 
    clear(state) {
      return {
        ...state,
      }
    }
  },
};

