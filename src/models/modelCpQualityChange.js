import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import { listCpQualityChange, addCpQualityChange, deleteCpQualityChange, getCpQualityChange } from '../services/api';

export default {
  namespace: 'cpQualityChange',

  state: {
    cpQualityChangeList: {
      list: [],
      pagination: {},
    },
    cpQualityChangeGet: {}
  },

  effects: {
    *cpQualityChange_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpQualityChange, value);
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
        type: 'cpQualityChangeList',
        payload: dataMSG,
      });
    },
    *cpQualityChange_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpQualityChange, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *cpQualityChange_Get({ payload, callback }, { call, put }) {
    const value = jsonToFormData(payload);
      const response = yield call(getCpQualityChange, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpQualityChangeGet',
        payload: response.data,
      });
    },
    *cpQualityChange_Delete({ payload, callback }, { call }) {
    const value = jsonToFormData(payload);
      const response = yield call(deleteCpQualityChange, value);
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
    cpQualityChangeList(state, action) {
      return {
        ...state,
        cpQualityChangeList: action.payload,
      };
    },
    cpQualityChangeGet(state, action) {
      return {
        ...state,
        cpQualityChangeGet: action.payload,
      };
    },
    clear(state) {
      return {
        ...state,
        // cpQualityChangeList: {
        //   list: [],
        //   pagination: {},
        // },
        cpQualityChangeGet: {},
      }
    }
  },
};

