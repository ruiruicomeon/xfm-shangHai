import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';
import {
  queryMemSysUser,
  addMemSysUser,
  getuserdetail,
  modeluserList,
  delSysUser
} from '../services/api';

export default {
  namespace: 'sysuser',

  state: {
    userlist: {
      list: [],
      pagination: {},
    },
    modeluserList: {
      list: [],
      pagination: {},
    },
    userdetail:{}
  },

  effects: {


    *del_SysUser({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(delSysUser, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("删除成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("删除失败");
      }
    },

    *modeluser_List({ payload , callback}, { call, put ,select}) {
      const value = jsonToFormData(payload);
        const { modeluserList: { list } } = yield select(state => state.sysuser);
        const response = yield call(modeluserList, value);
        let dataMSG = {};
        if (isNotBlank(response) && isNotBlank(response.data) ) {
          // let arrayList = [];
          // if (!isNotBlank(payload.current) || payload.current <= 1) {
          //   arrayList = [...response.data.list];
          // } else {
          //   arrayList = [...list, ...response.data.list];
          // }
          dataMSG = {
            list: isNotBlank(response.data.list)?response.data.list:[],
            pagination: response.data.pagination, 
          };
          if(callback) callback()
          // dataMSG = {
          //   list: arrayList,
          //   pagination: response.data.pagination,
          // };
        } else {
          dataMSG = {
            list: [],
            pagination: {},
          };
        }
        yield put({
          type: 'modeluserList',
          payload: dataMSG,
        });
    },


    *fetch({ payload , callback}, { call, put ,select}) {
      const value = jsonToFormData(payload);
        const { userlist: { list } } = yield select(state => state.sysuser);
        const response = yield call(queryMemSysUser, value);
        let dataMSG = {};
        if (isNotBlank(response) && isNotBlank(response.data)) {
          // let arrayList = [];
          // if (!isNotBlank(payload.current) || payload.current <= 1) {
          //   arrayList = [...response.data.list];
          // } else {
          //   arrayList = [...list, ...response.data.list];
          // }
          dataMSG = {
            list:isNotBlank(response.data.list)?response.data.list:[],
            pagination: response.data.pagination, 
          };
          if(callback) callback()
          // dataMSG = {
          //   list: arrayList,
          //   pagination: response.data.pagination,
          // };
        } else {
          dataMSG = {
            list: [],
            pagination: {},
          };
        }
        yield put({
          type: 'userlist',
          payload: dataMSG,
        });
    },
    *add_user({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(addMemSysUser, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("操作成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("操作失败");
      }
    },
    *getuser_detail({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getuserdetail, value);
      if (isNotBlank(response)&&isNotBlank(response.name)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'userdetail',
        payload: response,
      });
    },
  },

  reducers: {
    userlist(state, action) {
      return {
        ...state,
        userlist: action.payload,
      };
    },
    modeluserList(state, action) {
      return {
        ...state,
        modeluserList: action.payload,
      };
    },
    userdetail(state, action) {
      return {
        ...state,
        userdetail: action.payload,
      };
    },
    clear(state) {
      return {
        ...state,
        modeluserList:{
          list: [],
          pagination: {},
        },
        // userlist: {
        //   list: [],
        //   pagination: {},
        // },
        userdetail: {}
      }
    }
  },
};
