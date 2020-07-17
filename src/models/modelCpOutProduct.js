import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import { zcProuctStatistics,outMaterial, listCpOutProduct, addCpOutProduct , deleteCpOutProduct , getCpOutProduct } from '../services/api';

export default {
  namespace: 'cpOutProduct',

  state: {
    cpOutProductList: {
      list: [],
      pagination: {},
    },
    zcProuctStatisticslist: {
      list: [],
      pagination: {},
    },
    cpOutProductNotPageList: [],
    cpOutProductTreeDataList:[],
    cpOutProductGet: {}
  },

  effects: {
    *zcProuct_Statistics({ payload ,callback}, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(zcProuctStatistics, value);
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
        type: 'zcProuctStatisticslist',
        payload: dataMSG,
      });
    },

    *out_material({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(outMaterial, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("退料成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("退料失败");
      }
    },

    *cpOutProduct_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpOutProduct, value);
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
        type: 'cpOutProductList',
        payload: dataMSG,
      });
    },

    *cpOutProduct_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpOutProduct, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },

    *cpOutProduct_save_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpOutProduct, value);
      if (isNotBlank(response) && response.success === '1') {
        if (callback) callback();
      } 
    },
    *cpOutProduct_Get({ payload, callback }, { call, put }) {
    const value = jsonToFormData(payload);
      const response = yield call(getCpOutProduct, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpOutProductGet',
        payload: response.data,
      });
    },
    *cpOutProduct_Delete({ payload, callback }, { call }) {
    const value = jsonToFormData(payload);
      const response = yield call(deleteCpOutProduct, value);
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
    cpOutProductList(state, action) {
      return {
        ...state,
        cpOutProductList: action.payload,
      };
    },
    cpOutProductNotPageList(state, action) {
      return {
        ...state,
        cpOutProductNotPageList: action.payload,
      };
    },
    cpOutProductTreeDataList(state, action) {
      return {
        ...state,
        cpOutProductTreeDataList: action.payload,
      };
    },
    cpOutProductGet(state, action) {
      return {
        ...state,
        cpOutProductGet: action.payload,
      };
    },
    zcProuctStatisticslist(state, action) {
      return {
        ...state,
        zcProuctStatisticslist: action.payload,
      };
    },
    clear(state) {
      return {
        ...state,
        // zcProuctStatisticslist: {
        //   list: [],
        //   pagination: {},
        // },
        // cpOutProductList: {
        //   list: [],
        //   pagination: {},
        // },
        cpOutProductNotPageList: [],
        cpOutProductTreeDataList:[],
        cpOutProductGet: {},
      }
    }
  },
};

