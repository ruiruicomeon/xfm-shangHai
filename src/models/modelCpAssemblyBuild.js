import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import { getCpAssemblyBuildLine,listCpAssemblyBuild, addCpAssemblyBuild , deleteCpAssemblyBuild , getCpAssemblyBuild } from '../services/api';

export default {
  namespace: 'cpAssemblyBuild',

  state: {
    cpAssemblyBuildList: {
      list: [],
      pagination: {},
    },
    cpAssemblyBuildNotPageList: [],
    cpAssemblyBuildTreeDataList:[],
    cpAssemblyBuildGet: {},
    cpAssemblyBuildSearchList:{}
  },

  effects: {
    *cpAssemblyBuild_SearchList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpAssemblyBuildLine, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'cpAssemblyBuildSearchList',
        payload: dataMSG,
      });
    },
    *cpAssemblyBuild_List({ payload ,callback}, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpAssemblyBuild, value);
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
        type: 'cpAssemblyBuildList',
        payload: dataMSG,
      });
    },

    *get_cpAssemblyBuild_search_All({ payload ,callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpAssemblyBuild, value);
      if (isNotBlank(response) && isNotBlank(response.data)&&isNotBlank(response.data.list)&&response.data.list.length>0) {
        // dataMSG = response.data;
        message.success('查询成功')
        if(callback)  callback(response.data)
      } else {
        message.error('未查询到总成型号')
        // dataMSG = {
        //   list: [],
        //   pagination: {},
        };
    },
    *cpAssemblyBuild_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpAssemblyBuild, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *cpAssemblyBuild_Get({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpAssemblyBuild, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpAssemblyBuildGet',
        payload: response.data,
      });
    },
    *cpAssemblyBuild_Delete({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deleteCpAssemblyBuild, value);
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
    cpAssemblyBuildSearchList(state, action) {
      return {
        ...state,
        cpAssemblyBuildSearchList: action.payload,
      };
    },
    cpAssemblyBuildList(state, action) {
      return {
        ...state,
        cpAssemblyBuildList: action.payload,
      };
    },
    cpAssemblyBuildNotPageList(state, action) {
      return {
        ...state,
        cpAssemblyBuildNotPageList: action.payload,
      };
    },
    cpAssemblyBuildTreeDataList(state, action) {
      return {
        ...state,
        cpAssemblyBuildTreeDataList: action.payload,
      };
    },
    cpAssemblyBuildGet(state, action) {
      return {
        ...state,
        cpAssemblyBuildGet: action.payload,
      };
    },
    clear(state) {
      return {
        ...state,
        // cpAssemblyBuildList: {
        //   list: [],
        //   pagination: {},
        // },
        cpAssemblyBuildNotPageList: [],
        cpAssemblyBuildTreeDataList:[],
        cpAssemblyBuildGet: {},
        // ...state
        // cpAssemblyBuildSearchList:{}
      }
    }
  },
};

