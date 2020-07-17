import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import { listCpQualityCard, addCpQualityCard , deleteCpQualityCard , getCpQualityCard  } from '../services/api';

export default {
  namespace: 'cpQualityCard',

  state: {
    cpQualityCardList: {
      list: [],
      pagination: {},
    },
    cpQualityCardNotPageList: [],
    cpQualityCardTreeDataList:[],
    cpQualityCardGet: {}
  },

  effects: {
    *cpQualityCard_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpQualityCard, value);
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
        type: 'cpQualityCardList',
        payload: dataMSG,
      });
    },

    *cpQualityCard_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpQualityCard, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *cpQualityCard_Get({ payload, callback }, { call, put }) {
    const value = jsonToFormData(payload);
      const response = yield call(getCpQualityCard, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpQualityCardGet',
        payload: response.data,
      });
    },
    *cpQualityCard_Delete({ payload, callback }, { call }) {
    const value = jsonToFormData(payload);
      const response = yield call(deleteCpQualityCard, value);
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
    cpQualityCardList(state, action) {
      return {
        ...state,
        cpQualityCardList: action.payload,
      };
    },
    cpQualityCardNotPageList(state, action) {
      return {
        ...state,
        cpQualityCardNotPageList: action.payload,
      };
    },
    cpQualityCardTreeDataList(state, action) {
      return {
        ...state,
        cpQualityCardTreeDataList: action.payload,
      };
    },
    cpQualityCardGet(state, action) {
      return {
        ...state,
        cpQualityCardGet: action.payload,
      };
    },
    clear(state) {
      return {
        ...state,
        // cpQualityCardList: {
        //   list: [],
        //   pagination: {},
        // },
        cpQualityCardNotPageList: [],
        cpQualityCardTreeDataList:[],
        cpQualityCardGet: {},
      }
    }
  },
};

