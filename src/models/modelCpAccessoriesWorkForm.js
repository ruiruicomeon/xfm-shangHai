import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import { getCpAccessoriesWorkFormLine , getCpAccessoriesWorkRevocation ,  listCpAccessoriesWorkForm, addCpAccessoriesWorkForm , deleteCpAccessoriesWorkForm, getCpAccessoriesWorkForm  } from '../services/api';

export default {
  namespace: 'cpAccessoriesWorkForm',

  state: {
    cpAccessoriesWorkFormList: {
      list: [],
      pagination: {},
    },
    cpAccessoriesWorkFormNotPageList: [],
    cpAccessoriesWorkFormTreeDataList:[],
    cpAccessoriesWorkFormGet: {},
    CpAccessoriesWorkFormSearchList:{}
  },

  effects: {
    *CpAccessoriesWorkForm_SearchList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpAccessoriesWorkFormLine, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'CpAccessoriesWorkFormSearchList',
        payload: dataMSG,
      });
    },


  *CpAccessoriesWork_Revocation({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpAccessoriesWorkRevocation, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("撤销成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("撤销失败");
      }
    },

    *cpAccessoriesWorkForm_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpAccessoriesWorkForm, value);
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
        type: 'cpAccessoriesWorkFormList',
        payload: dataMSG,
      });
    },
    *cpAccessoriesWorkForm_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpAccessoriesWorkForm, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *cpAccessoriesWorkForm_Get({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpAccessoriesWorkForm, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpAccessoriesWorkFormGet',
        payload: response.data,
      });
    },
    *cpAccessoriesWorkForm_Delete({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deleteCpAccessoriesWorkForm, value);
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
    cpAccessoriesWorkFormList(state, action) {
      return {
        ...state,
        cpAccessoriesWorkFormList: action.payload,
      };
    },
    cpAccessoriesWorkFormNotPageList(state, action) {
      return {
        ...state,
        cpAccessoriesWorkFormNotPageList: action.payload,
      };
    },
    cpAccessoriesWorkFormTreeDataList(state, action) {
      return {
        ...state,
        cpAccessoriesWorkFormTreeDataList: action.payload,
      };
    },
    cpAccessoriesWorkFormGet(state, action) {
      return {
        ...state,
        cpAccessoriesWorkFormGet: action.payload,
      };
    },
    CpAccessoriesWorkFormSearchList(state, action) {
      return {
        ...state,
        CpAccessoriesWorkFormSearchList: action.payload,
      };
    },
    clear(state) {
      return {
        ...state,
        // cpAccessoriesWorkFormList: {
        //   list: [],
        //   pagination: {},
        // },
        cpAccessoriesWorkFormNotPageList: [],
        cpAccessoriesWorkFormTreeDataList:[],
        cpAccessoriesWorkFormGet: {},
        // CpAccessoriesWorkFormSearchList:{}
      }
    }
  },
};


