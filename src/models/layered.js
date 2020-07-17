import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';
import { deleteSysDoc,updateSysDoc,getSysDocList,postSysDoc,adddept , deletedept , querydeptlist } from '../services/api';

export default {
  namespace: 'sysdept',

  state: {

    deptlist:{
      list:[]
    },
    getsysdoclist:{
      list:[],
      pagination:{}
    }
  },

  effects: {
    
    *delete_sysDoc({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deleteSysDoc, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("删除成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("删除失败");
      }
    },

    *update_sysDoc({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(updateSysDoc, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("操作成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("操作失败");
      }
    },

    *getSysDocList({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
        const response = yield call(getSysDocList, value);
        let dataMSG = {};
        if (isNotBlank(response) && isNotBlank(response.data)) {
          dataMSG = response.data;
        } else {
          dataMSG = {};
        }
        yield put({
          type: 'getsysdoclist',
          payload: dataMSG,
        });
    },

    *add_announcement({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(postSysDoc, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("操作成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("操作失败");
      }
    },

      *query_dept({ payload }, { call, put }) {
        const value = jsonToFormData(payload);
          const response = yield call(querydeptlist, value);
          let dataMSG = {};
          if (isNotBlank(response) && isNotBlank(response.list)) {
            let arrayList = [];
              arrayList = [...response.list];
            dataMSG = {
               list:arrayList
            }
          } else {
            dataMSG = {
               list:[]
            }
          }
          yield put({
            type: 'deptlist',
            payload: dataMSG,
          });
      },
    *add_dept({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(adddept, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("操作成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("操作失败");
      }
    },
    *del_dept({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(deletedept, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("操作成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("操作失败");
      }
    },
  },

  reducers: {
    getsysdoclist(state, action) {
      return {
        ...state,
        getsysdoclist: action.payload,
      };
    },
    levellist(state, action) {
      return {
        ...state,
        levellist: action.payload,
      };
    },
    levellist1(state, action) {
        return {
          ...state,
          levellist1: action.payload,
        };
      },
      deptlist(state, action) {
    return {
      ...state,
      deptlist: action.payload,
    };
  },
  
  clear() {
    return {
      getsysdoclist: {
        list: [],
        pagination: {},
      },
      levellist: {
        list: [],
        pagination: {},
      },
      levellist1: {
        list: [],
        pagination: {},
      },
      deptlist: {
        list: [],
        pagination: {},
      },
    }
  }
}
};
