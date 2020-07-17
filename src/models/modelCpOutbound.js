import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import { listCpOutbound, addCpOutbound , deleteCpOutbound, updateCpOutbound, getCpOutbound  } from '../services/api';

export default {
  namespace: 'cpOutbound',

  state: {
    cpOutboundList: {
      list: [],
      pagination: {},
    },
    cpOutboundNotPageList: [],
    cpOutboundTreeDataList:[],
    cpOutboundGet: {}
  },

  effects: {
    *cpOutbound_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpOutbound, value);
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
        type: 'cpOutboundList',
        payload: dataMSG,
      });
    },
    *cpOutbound_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpOutbound, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *cpOutbound_Update({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(updateCpOutbound, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("修改成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("修改失败");
      }
    },
    *cpOutbound_Get({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpOutbound, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpOutboundGet',
        payload: response.data,
      });
    },
    *cpOutbound_Delete({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deleteCpOutbound, value);
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
    cpOutboundList(state, action) {
      return {
        ...state,
        cpOutboundList: action.payload,
      };
    },
    cpOutboundNotPageList(state, action) {
      return {
        ...state,
        cpOutboundNotPageList: action.payload,
      };
    },
    cpOutboundTreeDataList(state, action) {
      return {
        ...state,
        cpOutboundTreeDataList: action.payload,
      };
    },
    cpOutboundGet(state, action) {
      return {
        ...state,
        cpOutboundGet: action.payload,
      };
    },
    clear(state) {
      return {
        ...state,
        // cpOutboundList: {
        //   list: [],
        //   pagination: {},
        // },
        cpOutboundNotPageList: [],
        cpOutboundTreeDataList:[],
        cpOutboundGet: {},
        // ...state
      }
    }
  },
};
