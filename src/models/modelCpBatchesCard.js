import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import {cpBatchesCardRevocation, getCpBatchesCardDetailList, postCpBatchesCardDetail , deleteCpBatchesCardDetail , listCpBatchesCard, addCpBatchesCard, deleteCpBatchesCard, getCpBatchesCard } from '../services/api';

export default {
  namespace: 'cpBatchesCard',

  state: {
    cpBatchesCardList: {
      list: [],
      pagination: {},
    },
    getCpBatchesCardDetailList: {
      list: [],
      pagination: {},
    },
    cpBatchesCardGet: {}
  },

  effects: {
    *cpBatchesCard_Revocation({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpBatchesCardRevocation, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("撤销成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("撤销失败");
      }
    },

    *get_CpBatchesCardDetailList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpBatchesCardDetailList, value);
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
        type: 'getCpBatchesCardDetailList',
        payload: dataMSG,
      });
    },

    *post_CpBatchesCardDetail({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(postCpBatchesCardDetail, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("操作成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("操作失败");
      }
    },

      *delete_CpBatchesCardDetail({ payload, callback }, { call }) {
        const value = jsonToFormData(payload);
        const response = yield call(deleteCpBatchesCardDetail, value);
        if (isNotBlank(response) && response.success === '1') {
          message.success("删除成功");
          if (callback) callback();
        } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
          message.error(response.msg);
        } else {
          message.error("删除失败");
        }
      },

    *cpBatchesCard_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpBatchesCard, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },


    *cpBatchesCard_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listCpBatchesCard, value);
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
        type: 'cpBatchesCardList',
        payload: dataMSG,
      });
    },
    *cpBatchesCard_Add({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addCpBatchesCard, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("新增成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("新增失败");
      }
    },
    *cpBatchesCard_Get({ payload, callback }, { call, put }) {
    const value = jsonToFormData(payload);
      const response = yield call(getCpBatchesCard, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'cpBatchesCardGet',
        payload: response.data,
      });
    },
    *cpBatchesCard_Delete({ payload, callback }, { call }) {
    const value = jsonToFormData(payload);
      const response = yield call(deleteCpBatchesCard, value);
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
    cpBatchesCardList(state, action) {
      return {
        ...state,
        cpBatchesCardList: action.payload,
      };
    },
    cpBatchesCardGet(state, action) {
      return {
        ...state,
        cpBatchesCardGet: action.payload,
      };
    },
    getCpBatchesCardDetailList(state, action) {
      return {
        ...state,
        getCpBatchesCardDetailList: action.payload,
      };
    },
    clear(state) {
      return {
        ...state,
        // cpBatchesCardList: {
        //   list: [],
        //   pagination: {},
        // },
        getCpBatchesCardDetailList: {
          list: [],
          pagination: {},
        },
        cpBatchesCardGet: {},
        // ...state
      }
    }
  },
};

