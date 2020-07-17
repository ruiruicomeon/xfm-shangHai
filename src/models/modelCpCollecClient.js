import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import { listCpCollecClient, addCpCollecClient , deleteCpCollecClient , getCpCollecClient } from '../services/api';

export default {
  namespace: 'cpCollecClient',

  state: {
    cpCollecClientList: {
      list: [],
      pagination: {},
    },
    cpCollecClientNotPageList: [],
    cpCollecClientTreeDataList:[],
    cpCollecClientGet: {}
  },

  effects: {
    *cpCollecClient_List({ payload ,callback}, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpCollecClient, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if(callback) callback()
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'cpCollecClientList',
        payload: dataMSG,
      });
    },

    *cpCollecClient_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpCollecClient, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *cpCollecClient_Get({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpCollecClient, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpCollecClientGet',
        payload: response.data,
      });
    },
    *cpCollecClient_Delete({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deleteCpCollecClient, value);
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
    cpCollecClientList(state, action) {
      return {
        ...state,
        cpCollecClientList: action.payload,
      };
    },
    cpCollecClientNotPageList(state, action) {
      return {
        ...state,
        cpCollecClientNotPageList: action.payload,
      };
    },
    cpCollecClientTreeDataList(state, action) {
      return {
        ...state,
        cpCollecClientTreeDataList: action.payload,
      };
    },
    cpCollecClientGet(state, action) {
      return {
        ...state,
        cpCollecClientGet: action.payload,
      };
    },
    clear(state) {
      return {
        ...state,
        // cpCollecClientList: {
        //   list: [],
        //   pagination: {},
        // },
        cpCollecClientNotPageList: [],
        cpCollecClientTreeDataList:[],
        cpCollecClientGet: {},
        // ...state
      }
    }
  },
};


