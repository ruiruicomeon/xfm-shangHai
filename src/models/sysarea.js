import { isNotBlank, jsonToFormData } from '@/utils/utils';
import {deldict , queryMemSysArea ,saveArea  ,getFlatCode ,getFlatOrderdCode} from '../services/api';
import { message } from 'antd';

export default {
  namespace: 'sysarea',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    arealist :{
      list: [],
      pagination: {},
    },
    codedata:{},
    codeorderdata:{},
    dicts: [],
  },

  effects: {
    *remove({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deldict, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("删除成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("删除失败");
      }
    },

    *getFlatOrderdCode({ payload ,callback}, { call, put }) {
      // const value = jsonToFormData(payload);
      const response = yield call(getFlatOrderdCode, payload);
      let dataMSG = {};
      if(isNotBlank(response)) {
        dataMSG = response
        if(callback) callback(response)
      } else {
        dataMSG ={}
      }
      yield put({
        type: 'codeorderdata',
        payload: dataMSG,
      });
    },

    *getFlatCode({ payload ,callback}, { call, put }) {
      // const value = jsonToFormData(payload);
      const response = yield call(getFlatCode, payload);
      let dataMSG = {};
      if(isNotBlank(response)) {
        dataMSG = response;
        if(callback) callback(response)
      } else {
        dataMSG ={}
      }
      yield put({
        type: 'codedata',
        payload: dataMSG,
      });
    },

    *fetch({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(queryMemSysArea, value);
      let dataMSG = {};
      if(isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'arealist',
        payload: dataMSG,
      });
    },
    *save_area({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(saveArea, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("操作成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("操作失败");
      }
    },
    // *add({ payload, callback }, { call, put }) {
    //   const addrequest = yield call(addMemSysArea, payload);
    //   if (addrequest.success === '1') {
    //     message.success(addrequest.msg);
    //     const response = yield call(queryMemSysArea);
    //     if (
    //       response.list == null ||
    //       response.list === 'undefind' ||
    //       typeof response.list === 'undefined'
    //     ) {
    //       response.list = [];
    //     }
    //     yield put({
    //       type: 'save',
    //       payload: response,
    //     });
    //   } else {
    //     message.error(addrequest.msg);
    //   }
    //   if (callback) callback();
    // },
    // *dicts({ payload }, { call, put }) {
    //   const response = yield call(queryDicts, payload);
    //   yield put({
    //     type: 'saveDicts',
    //     payload: Array.isArray(response) ? response : [],
    //   });
    // },
  },

  reducers: {
    codeorderdata(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    codedata(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    arealist(state, action) {
      return {
        ...state,
        arealist: action.payload,
      };
    },
    saveDicts(state, action) {
      return {
        ...state,
        dicts: action.payload,
      };
    },
    clear() {
      return {
        arealist: {
            list: [],
            pagination: {},
          },
          data: {
            list: [],
            pagination: {},
          },
          codedata:{},
          codeorderdata:{}
      }
    }
  },
};
