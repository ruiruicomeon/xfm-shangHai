import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import { updateQuitFromDetail ,listCpQuitFrom, addCpQuitFrom , deleteCpQuitFrom , getCpQuitFrom  } from '../services/api';

export default {
  namespace: 'cpQuitFrom',

  state: {
    cpQuitFromList: {
      list: [],
      pagination: {},
    },
    cpQuitFromNotPageList: [],
    cpQuitFromTreeDataList:[],
    cpQuitFromGet: {}
  },

  effects: {
    *update_quit_from_detail({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(updateQuitFromDetail, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("修改成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("修改失败");
      }
    },

    *cpQuitFrom_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpQuitFrom, value);
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
        type: 'cpQuitFromList',
        payload: dataMSG,
      });
    },

    *cpQuitFrom_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpQuitFrom, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *cpQuitFrom_Get({ payload, callback }, { call, put }) {
    const value = jsonToFormData(payload);
      const response = yield call(getCpQuitFrom, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpQuitFromGet',
        payload: response.data,
      });
    },
    *cpQuitFrom_Delete({ payload, callback }, { call }) {
    const value = jsonToFormData(payload);
      const response = yield call(deleteCpQuitFrom, value);
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
    cpQuitFromList(state, action) {
      return {
        ...state,
        cpQuitFromList: action.payload,
      };
    },
    cpQuitFromNotPageList(state, action) {
      return {
        ...state,
        cpQuitFromNotPageList: action.payload,
      };
    },
    cpQuitFromTreeDataList(state, action) {
      return {
        ...state,
        cpQuitFromTreeDataList: action.payload,
      };
    },
    cpQuitFromGet(state, action) {
      return {
        ...state,
        cpQuitFromGet: action.payload,
      };
    },
    clear(state) {
      return {
        ...state,
        // cpQuitFromList: {
        //   list: [],
        //   pagination: {},
        // },
        cpQuitFromNotPageList: [],
        cpQuitFromTreeDataList:[],
        cpQuitFromGet: {},
      }
    }
  },
};

