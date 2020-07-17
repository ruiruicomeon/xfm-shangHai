import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import { postCpOutSalesFrom, createPurchaseDetail , deleteCpInStorageDetail , listCpInStorageFrom, addCpInStorageFrom , deleteCpInStorageFrom , getCpInStorageFrom } from '../services/api';

export default {
  namespace: 'cpInStorageFrom',

  state: {
    cpInStorageFromList: {
      list: [],
      pagination: {},
    },
    cpInStorageFromNotPageList: [],
    cpInStorageFromTreeDataList:[],
    cpInStorageFromGet: {}
  },

  effects: {
    *post_Cp_OutSales_From({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
        const response = yield call(postCpOutSalesFrom , value);
        if (isNotBlank(response) && (response.success === '1' || response.success === 1)) {
          message.success("操作成功");
          if (callback) callback();
        } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
          message.error(response.msg);
        } else if (isNotBlank(response) && (response.success === '0' || response.success === 0)) {
          message.error("操作失败");
        }
      },

    *create_Purchase_Detail({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
        const response = yield call(createPurchaseDetail , value);
        if (isNotBlank(response) && (response.success === '1' || response.success === 1)) {
          message.success("添加成功");
          if (callback) callback();
        } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
          message.error(response.msg);
        } else if (isNotBlank(response) && (response.success === '0' || response.success === 0)) {
          message.error("添加失败");
        }
      },

    *cpInStorage_Delete({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
        const response = yield call(deleteCpInStorageDetail, value);
        if (isNotBlank(response) && (response.success === '1' || response.success === 1)) {
          message.success("删除成功");
          if (callback) callback();
        } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
          message.error(response.msg);
        } else if (isNotBlank(response) && (response.success === '0' || response.success === 0)) {
          message.error("删除失败");
        }
      },

    *cpInStorageFrom_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpInStorageFrom, value);
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
        type: 'cpInStorageFromList',
        payload: dataMSG,
      });
    },
    *cpInStorageFrom_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpInStorageFrom, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *cpInStorageFrom_save_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpInStorageFrom, value);
      if (isNotBlank(response) && response.success === '1') {
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        // message.error(response.msg);
      } 
    },
    *cpInStorageFrom_Get({ payload, callback }, { call, put }) {
    const value = jsonToFormData(payload);
      const response = yield call(getCpInStorageFrom, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpInStorageFromGet',
        payload: response.data,
      });
    },

    *cpInStorageFrom_print_Get({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
        const response = yield call(getCpInStorageFrom, value);
        if (isNotBlank(response) && isNotBlank(response.data)) {
          if (callback) callback(response);
        }
      },

    *cpInStorageFrom_Delete({ payload, callback }, { call }) {
    const value = jsonToFormData(payload);
      const response = yield call(deleteCpInStorageFrom, value);
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
    cpInStorageFromList(state, action) {
      return {
        ...state,
        cpInStorageFromList: action.payload,
      };
    },
    cpInStorageFromNotPageList(state, action) {
      return {
        ...state,
        cpInStorageFromNotPageList: action.payload,
      };
    },
    cpInStorageFromTreeDataList(state, action) {
      return {
        ...state,
        cpInStorageFromTreeDataList: action.payload,
      };
    },
    cpInStorageFromGet(state, action) {
      return {
        ...state,
        cpInStorageFromGet: action.payload,
      };
    },
    clear(state) {
      return {
        ...state,
        // cpInStorageFromList: {
        //   list: [],
        //   pagination: {},
        // },
        cpInStorageFromNotPageList: [],
        cpInStorageFromTreeDataList:[],
        cpInStorageFromGet: {},
        // ...state
      }
    }
  },
};

