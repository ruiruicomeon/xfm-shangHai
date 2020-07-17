import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import { listCpPjEntrepot, addCpPjEntrepot , deleteCpPjEntrepot , getCpPjEntrepot  } from '../services/api';

export default {
  namespace: 'cpPjEntrepot',

  state: {
    cpPjEntrepotList: {
      list: [],
      pagination: {},
    },
    cpPjEntrepotNotPageList: [],
    cpPjEntrepotTreeDataList:[],
    cpPjEntrepotGet: {}
  },

  effects: {
    *cpPjEntrepot_List({ payload ,callback}, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpPjEntrepot, value);
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
        type: 'cpPjEntrepotList',
        payload: dataMSG,
      });
    },
    *cpPjEntrepot_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpPjEntrepot, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *cpPjEntrepot_Get({ payload, callback }, { call, put }) {
    const value = jsonToFormData(payload);
      const response = yield call(getCpPjEntrepot, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpPjEntrepotGet',
        payload: response.data,
      });
    },
    *cpPjEntrepot_Delete({ payload, callback }, { call }) {
    const value = jsonToFormData(payload);
      const response = yield call(deleteCpPjEntrepot, value);
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
    cpPjEntrepotList(state, action) {
      return {
        ...state,
        cpPjEntrepotList: action.payload,
      };
    },
    cpPjEntrepotNotPageList(state, action) {
      return {
        ...state,
        cpPjEntrepotNotPageList: action.payload,
      };
    },
    cpPjEntrepotTreeDataList(state, action) {
      return {
        ...state,
        cpPjEntrepotTreeDataList: action.payload,
      };
    },
    cpPjEntrepotGet(state, action) {
      return {
        ...state,
        cpPjEntrepotGet: action.payload,
      };
    },
    clear(state) {
      return {
        ...state,
        // cpPjEntrepotList: {
        //   list: [],
        //   pagination: {},
        // },
        cpPjEntrepotNotPageList: [],
        cpPjEntrepotTreeDataList:[],
        cpPjEntrepotGet: {},
      }
    }
  },
};

