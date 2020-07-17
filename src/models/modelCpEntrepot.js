import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import { listCpEntrepot, addCpEntrepot , deleteCpEntrepot , getCpEntrepot } from '../services/api';

export default {
  namespace: 'cpEntrepot',

  state: {
    cpEntrepotList: {
      list: [],
      pagination: {},
    },
    cpEntrepotNotPageList: [],
    cpEntrepotTreeDataList:[],
    cpEntrepotGet: {}
  },

  effects: {
    *cpEntrepot_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpEntrepot, value);
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
        type: 'cpEntrepotList',
        payload: dataMSG,
      });
    },
    *cpEntrepot_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpEntrepot, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *cpEntrepot_Get({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpEntrepot, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpEntrepotGet',
        payload: response.data,
      });
    },
    *cpEntrepot_Delete({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deleteCpEntrepot, value);
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
    cpEntrepotList(state, action) {
      return {
        ...state,
        cpEntrepotList: action.payload,
      };
    },
    cpEntrepotNotPageList(state, action) {
      return {
        ...state,
        cpEntrepotNotPageList: action.payload,
      };
    },
    cpEntrepotTreeDataList(state, action) {
      return {
        ...state,
        cpEntrepotTreeDataList: action.payload,
      };
    },
    cpEntrepotGet(state, action) {
      return {
        ...state,
        cpEntrepotGet: action.payload,
      };
    },
    clear() {
      return {
        cpEntrepotList: {
          list: [],
          pagination: {},
        },
        cpEntrepotNotPageList: [],
        cpEntrepotTreeDataList:[],
        cpEntrepotGet: {},
      }
    }
  },
};

