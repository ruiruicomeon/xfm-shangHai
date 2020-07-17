import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import {
  getCpBillMaterialAll, listCpBillMaterial, addCpBillMaterial, listNotPageCpBillMaterial, deleteCpBillMaterial,
  updateCpBillMaterial, getCpBillMaterial, listCpBillMaterialTreeData, deleteCpBillType,
  getCpBillSingelList, postCpBillSingel, deleteCpBillSingel, getZhCpBillSingelList, updateBacth, getCpBillMaterialList,
  getMaterialQuery
} from '../services/api';

export default {
  namespace: 'cpBillMaterial',

  state: {
    cpBillMaterialList: {
      list: [],
      pagination: {},
    },
    cpBillMaterialMiddleList: {
      list: [],
      pagination: {},
    },
    zhCpBillSingelList: {
      list: [],
      pagination: {},
    },
    getcpBillMaterialAll: {
      list: [],
      pagination: {},
    },
    cpBillMaterialNotPageList: [],
    cpBillMaterialTreeDataList: [],
    cpBillMaterialGet: {},
    getcpBillmaterialList1: {
      list: [],
      pagination: {},
    },
    getcpBillmaterialList2: {
      list: [],
      pagination: {},
    },
    getMaterialQueryDate: {}
  },

  effects: {
    *delete_CpBillType({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deleteCpBillType, value);
      if (isNotBlank(response) && (response.success === '1' || response.success === 1)) {
        message.success("删除成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0)) {
        message.error("删除失败");
      }
    },

    *updateBacth({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(updateBacth, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("操作成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("操作失败");
      }
    },

    *get_cpBill_caterialList1({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpBillMaterialList, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback(response.data)
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'getcpBillmaterialList1',
        payload: dataMSG,
      });
    },

    *get_cpBill_caterialList2({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpBillMaterialList, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback(response.data)
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'getcpBillmaterialList2',
        payload: dataMSG,
      });
    },


    *get_cpBillMaterial_All({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpBillMaterialAll, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback(response.data)
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'getcpBillMaterialAll',
        payload: dataMSG,
      });
    },


    *get_cpBillMaterial_search_All({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpBillMaterialAll, value);
      if (isNotBlank(response) && isNotBlank(response.data) && isNotBlank(response.data.list) && response.data.list.length > 0) {
        // dataMSG = response.data;
        message.success('查询成功')
        if (callback) callback(response.data)
      } else {
        message.error('未查询到物料编码')
        // dataMSG = {
        //   list: [],
        //   pagination: {},
      };
    },

    *get_ZhCpBillSingel_List({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getZhCpBillSingelList, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback(response.data)
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'zhCpBillSingelList',
        payload: dataMSG,
      });
    },

    *cpBillMaterial_middle_List({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpBillSingelList, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback(response.data)
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'cpBillMaterialMiddleList',
        payload: dataMSG,
      });
    },
    *cpBillMaterial_middle_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(postCpBillSingel, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *cpBillMaterial_middle_Delete({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deleteCpBillSingel, value);
      if (isNotBlank(response) && (response.success === '1' || response.success === 1)) {
        message.success("删除成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0)) {
        message.error("删除失败");
      }
    },
    *cpBillMaterial_List({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpBillMaterial, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback(response.data)
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'cpBillMaterialList',
        payload: dataMSG,
      });
    },

    *cpBillMaterial_search_List({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpBillMaterial, value);
      // let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data) && isNotBlank(response.data.list) && response.data.list.length > 0) {
        // dataMSG = response.data;
        message.success('查询成功')
        if (callback) callback(response.data)
      } else {
        message.error('未查询到物料编码')
        // dataMSG = {
        //   list: [],
        //   pagination: {},
      };
      // }
      // yield put({
      //   type: 'cpBillMaterialList',
      //   payload: dataMSG,
      // });
    },

    *cpBillMaterial_NotPageList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listNotPageCpBillMaterial, value);
      let dataMSG = [];
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = [];
      }
      yield put({
        type: 'cpBillMaterialNotPageList',
        payload: dataMSG,
      });
    },
    *cpBillMaterial_TreeData({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpBillMaterialTreeData, value);
      let dataMSG = [];
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = [];
      }
      yield put({
        type: 'cpBillMaterialTreeDataList',
        payload: dataMSG,
      });
    },
    *cpBillMaterial_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpBillMaterial, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *cpBillMaterial_Update({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(updateCpBillMaterial, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("修改成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("修改失败");
      }
    },
    *cpBillMaterial_Get({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpBillMaterial, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpBillMaterialGet',
        payload: response.data,
      });
    },
    *cpBillMaterial_Delete({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deleteCpBillMaterial, value);
      if (isNotBlank(response) && (response.success === '1' || response.success === 1)) {
        message.success("删除成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0)) {
        message.error("删除失败");
      }
    },

    *getMaterial_Query({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getMaterialQuery, value);
      if (isNotBlank(response) && (response.success === '1' || response.success === 1)) {
        yield put({
          type: 'Save_getMaterial_Query',
          payload: response.data,
        });
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else if( isNotBlank(response) && response.success === 0 || response.success === 0  ){
        message.error('没有查询到该物料')
      }
    },
  },


  reducers: {
    getcpBillMaterialAll(state, action) {
      return {
        ...state,
        getcpBillMaterialAll: action.payload,
      };
    },
    cpBillMaterialList(state, action) {
      return {
        ...state,
        cpBillMaterialList: action.payload,
      };
    },
    cpBillMaterialMiddleList(state, action) {
      return {
        ...state,
        cpBillMaterialMiddleList: action.payload,
      };
    },
    cpBillMaterialNotPageList(state, action) {
      return {
        ...state,
        cpBillMaterialNotPageList: action.payload,
      };
    },
    cpBillMaterialTreeDataList(state, action) {
      return {
        ...state,
        cpBillMaterialTreeDataList: action.payload,
      };
    },
    cpBillMaterialGet(state, action) {
      return {
        ...state,
        cpBillMaterialGet: action.payload,
      };
    },
    zhCpBillSingelList(state, action) {
      return {
        ...state,
        zhCpBillSingelList: action.payload,
      };
    },
    getcpBillmaterialList1(state, action) {
      return {
        ...state,
        getcpBillmaterialList1: action.payload,
      };
    },
    getcpBillmaterialList2(state, action) {
      return {
        ...state,
        getcpBillmaterialList2: action.payload,
      };
    },
    Save_getMaterial_Query(state, action) {
      return {
        ...state,
        getMaterialQueryDate: action.payload,
      };
    },

    clear(state) {
      return {
        ...state,
        // getcpBillmaterialList1: {
        //   list: [],
        //   pagination: {},
        // },
        // getcpBillmaterialList2: {
        //   list: [],
        //   pagination: {},
        // },
        zhCpBillSingelList: {
          list: [],
          pagination: {},
        },
        cpBillMaterialList: {
          list: [],
          pagination: {},
        },
        cpBillMaterialMiddleList: {
          list: [],
          pagination: {},
        },
        getcpBillMaterialAll: {
          list: [],
          pagination: {},
        },
        cpBillMaterialNotPageList: [],
        cpBillMaterialTreeDataList: [],
        cpBillMaterialGet: {},
      }
    }
  },
};

