import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import { listCpTwoCode, addCpTwoCode , deleteCpTwoCode , getCpTwoCode } from '../services/api';

export default {
  namespace: 'cpTwoCode',

  state: {
    cpTwoCodeList: {
      list: [],
      pagination: {},
    },
    cpTwoCodeNotPageList: [],
    cpTwoCodeTreeDataList:[],
    cpTwoCodeGet: {}
  },

  effects: {
    *cpTwoCode_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpTwoCode, value);
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
        type: 'cpTwoCodeList',
        payload: dataMSG,
      });
    },
    *cpTwoCode_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpTwoCode, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *cpTwoCode_Get({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpTwoCode, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpTwoCodeGet',
        payload: response.data,
      });
    },
    *cpTwoCode_Delete({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deleteCpTwoCode, value);
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
    cpTwoCodeList(state, action) {
      return {
        ...state,
        cpTwoCodeList: action.payload,
      };
    },
    cpTwoCodeNotPageList(state, action) {
      return {
        ...state,
        cpTwoCodeNotPageList: action.payload,
      };
    },
    cpTwoCodeTreeDataList(state, action) {
      return {
        ...state,
        cpTwoCodeTreeDataList: action.payload,
      };
    },
    cpTwoCodeGet(state, action) {
      return {
        ...state,
        cpTwoCodeGet: action.payload,
      };
    },
    clear(state) {
      return {
        ...state,
        // cpTwoCodeList: {
        //   list: [],
        //   pagination: {},
        // },
        cpTwoCodeNotPageList: [],
        cpTwoCodeTreeDataList:[],
        cpTwoCodeGet: {},
      }
    }
  },
};

