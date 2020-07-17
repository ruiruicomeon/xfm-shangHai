import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import { getCpClientList, updateMustParent, getMustCpTypeList , postMustCpType, getCpTypeListNo ,getCpBillMaterialListNo, deleteCpType, getCpType , getCpTypeList , postCpType ,listCpClient, addCpClient, listNotPageCpClient, deleteCpClient, updateCpClient, getCpClient, listCpClientTreeData, listSearchCpLient } from '../services/api';

export default {
  namespace: 'cpClient',

  state: {
    cpClientList: {
      list: [],
      pagination: {},
    },
    cpTypelist: {
      list: [],
      pagination: {},
    },
    getCpTypeNoList:{
      list: [],
      pagination: {},
    },
    getCpBillMaterialNoList:{
      list: [],
      pagination: {},
    },
    getMustCpTypelist:{
      list: [],
      pagination: {},
    },
    getCpBillMaterialListNo1:{
      list: [],
      pagination: {},
    },
    getCpBillMaterialListNo2:{
      list: [],
      pagination: {},
    },
    cpClientNotPageList: [],
    cpClientTreeDataList: [],
    cpClientGet: {},
    getcpType:{},
    cpClientSearchList: {},
    getCpClientList:{
      list: [],
      pagination: {},
    }
  },

  effects: {

    *get_CpClientList({ payload ,callback}, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpClientList, value);
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
        type: 'getCpClientList',
        payload: dataMSG,
      });
    },


    *get_Must_CpTypeList({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getMustCpTypeList, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'getMustCpTypelist',
        payload: response.data,
      });
    },

    *update_Must_Parent({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(updateMustParent, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },

    *post_must_CpType({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(postMustCpType, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },

    *get_CpBillMaterial_ListNo1({ payload ,callback}, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpBillMaterialListNo, value);
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
        type: 'getCpBillMaterialListNo1',
        payload: dataMSG,
      });
    },

    *get_CpBillMaterial_ListNo2({ payload ,callback}, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpBillMaterialListNo, value);
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
        type: 'getCpBillMaterialListNo2',
        payload: dataMSG,
      });
    },

    // *post_must_CpType({ payload, callback }, { call }) {
    //   const value = jsonToFormData(payload);
    //   const response = yield call(deleteCpType, value);
    //   if (isNotBlank(response) && (response.success === '1' || response.success === 1)) {
    //     message.success("新增成功");
    //     if (callback) callback();
    //   } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
    //     message.error(response.msg);
    //   } else if (isNotBlank(response) && (response.success === '0' || response.success === 0)) {
    //     message.error("新增失败");
    //   }
    // },

    *get_cpBillMaterialList_no({ payload ,callback}, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpBillMaterialListNo, value);
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
        type: 'getCpBillMaterialNoList',
        payload: dataMSG,
      });
    },

    *get_cpTypeList_no({ payload ,callback}, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpTypeListNo, value);
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
        type: 'getCpTypeNoList',
        payload: dataMSG,
      });
    },


    *delete_CpType({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deleteCpType, value);
      if (isNotBlank(response) && (response.success === '1' || response.success === 1)) {
        message.success("删除成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0)) {
        message.error("删除失败");
      }
    },

    *get_CpType({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpType, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'getcpType',
        payload: response.data,
      });
    },

    *post_cpType({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(postCpType, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },

    *get_CpType_List({ payload ,callback}, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpTypeList, value);
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
        type: 'cpTypelist',
        payload: dataMSG,
      });
    },

    *cpClient_List({ payload ,callback}, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpClient, value);
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
        type: 'cpClientList',
        payload: dataMSG,
      });
    },
    *cpClient_SearchList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listSearchCpLient, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'cpClientSearchList',
        payload: dataMSG,
      });
    },
    *cpClient_NotPageList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listNotPageCpClient, value);
      let dataMSG = [];
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = [];
      }
      yield put({
        type: 'cpClientNotPageList',
        payload: dataMSG,
      });
    },
    *cpClient_TreeData({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpClientTreeData, value);
      let dataMSG = [];
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = [];
      }
      yield put({
        type: 'cpClientTreeDataList',
        payload: dataMSG,
      });
    },
    *cpClient_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpClient, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *cpClient_Update({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(updateCpClient, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("修改成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("修改失败");
      }
    },
    *cpClient_Get({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpClient, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpClientGet',
        payload: response.data,
      });
    },
    *cpClient_Delete({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deleteCpClient, value);
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
    cpClientList(state, action) {
      return {
        ...state,
        cpClientList: action.payload,
      };
    },
    cpClientSearchList(state, action) {
      return {
        ...state,
        cpClientSearchList: action.payload,
      };
    },
    cpClientNotPageList(state, action) {
      return {
        ...state,
        cpClientNotPageList: action.payload,
      };
    },
    cpClientTreeDataList(state, action) {
      return {
        ...state,
        cpClientTreeDataList: action.payload,
      };
    },
    cpClientGet(state, action) {
      return {
        ...state,
        cpClientGet: action.payload,
      };
    },
    cpTypelist(state, action) {
      return {
        ...state,
        cpTypelist: action.payload,
      };
    },
    getcpType(state, action) {
      return {
        ...state,
        getcpType: action.payload,
      };
    },
    getCpTypeNoList(state, action) {
      return {
        ...state,
        getCpTypeNoList: action.payload,
      };
    },
    getCpBillMaterialNoList(state, action) {
      return {
        ...state,
        getCpBillMaterialNoList: action.payload,
      };
    },
    getmustCpTypelist(state, action) {
      return {
        ...state,
        getmustCpTypelist: action.payload,
      };
    },
    getCpBillMaterialListNo1(state, action) {
      return {
        ...state,
        getCpBillMaterialListNo1: action.payload,
      };
    },
    getCpBillMaterialListNo2(state, action) {
      return {
        ...state,
        getCpBillMaterialListNo2: action.payload,
      };
    },
    getMustCpTypelist(state, action) {
      return {
        ...state,
        getMustCpTypelist: action.payload,
      };
    },
    getCpClientList(state, action) {
      return {
        ...state,
        getCpClientList: action.payload,
      };
    },
    clear(state) {
      return {
        getCpClientList:{
          list: [],
          pagination: {},
        },
        getMustCpTypelist: {
          list: [],
          pagination: {},
        },
        getCpBillMaterialListNo1: {
          list: [],
          pagination: {},
        },
        getCpBillMaterialListNo2: {
          list: [],
          pagination: {},
        },
        getCpBillMaterialNoList: {
          list: [],
          pagination: {},
        },
        getCpTypeNoList: {
          list: [],
          pagination: {},
        },
        cpTypelist: {
          list: [],
          pagination: {},
        },
        cpClientList: {
          list: [],
          pagination: {},
        },
        getcpType:{},
        cpClientNotPageList: [],
        cpClientTreeDataList: [],
        cpClientGet: {},
        ...state
      }
    }
  },
};

