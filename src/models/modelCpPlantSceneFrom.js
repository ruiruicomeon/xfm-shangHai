import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import { listCpPlantSceneFrom, addCpPlantSceneFrom , deleteCpPlantSceneFrom , getCpPlantSceneFrom  } from '../services/api';

export default {
  namespace: 'cpPlantSceneFrom',

  state: {
    cpPlantSceneFromList: {
      list: [],
      pagination: {},
    },
    cpPlantSceneFromNotPageList: [],
    cpPlantSceneFromTreeDataList:[],
    cpPlantSceneFromGet: {}
  },

  effects: {
    *cpPlantSceneFrom_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpPlantSceneFrom, value);
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
        type: 'cpPlantSceneFromList',
        payload: dataMSG,
      });
    },
    *cpPlantSceneFrom_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpPlantSceneFrom, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *cpPlantSceneFrom_Get({ payload, callback }, { call, put }) {
    const value = jsonToFormData(payload);
      const response = yield call(getCpPlantSceneFrom, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpPlantSceneFromGet',
        payload: response.data,
      });
    },
    *cpPlantSceneFrom_Delete({ payload, callback }, { call }) {
    const value = jsonToFormData(payload);
      const response = yield call(deleteCpPlantSceneFrom, value);
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
    cpPlantSceneFromList(state, action) {
      return {
        ...state,
        cpPlantSceneFromList: action.payload,
      };
    },
    cpPlantSceneFromNotPageList(state, action) {
      return {
        ...state,
        cpPlantSceneFromNotPageList: action.payload,
      };
    },
    cpPlantSceneFromTreeDataList(state, action) {
      return {
        ...state,
        cpPlantSceneFromTreeDataList: action.payload,
      };
    },
    cpPlantSceneFromGet(state, action) {
      return {
        ...state,
        cpPlantSceneFromGet: action.payload,
      };
    },
    clear() {
      return {
        cpPlantSceneFromList: {
          list: [],
          pagination: {},
        },
        cpPlantSceneFromNotPageList: [],
        cpPlantSceneFromTreeDataList:[],
        cpPlantSceneFromGet: {},
      }
    }
  },
};


