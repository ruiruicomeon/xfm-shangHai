import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';
import {
  dictlist,
  adddict,
  deldict
} from '../services/api';

export default {
  namespace: 'dictionaryL',

  state: {
    listdict: {
      list: [],
      pagination: {},
    }
  },

  effects: {
    *fetch({ payload ,callback}, { call, put }) {
      const value = jsonToFormData(payload);
        const response = yield call(dictlist, value);
        let dataMSG = {};
        if (isNotBlank(response) && isNotBlank(response.data)) {
          dataMSG = {
            list: isNotBlank(response.data.list)?response.data.list:[],
            pagination: response.data.pagination, 
          };
          if(callback) callback(response.data)
        } else {
          dataMSG = {
            list: [],
            pagination: {},
          };
        }
        yield put({
          type: 'listdict',
          payload: dataMSG,
        });
    },
    *add_dict({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(adddict, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("操作成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("操作失败");
      }
    },
    *del_dict({ payload, callback }, { call }) {
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
  },

  reducers: {
    listdict(state, action) {
      return {
        ...state,
        listdict: action.payload,
      };
    },
    clear() {
      return {
        listdict: {
          list: [],
          pagination: {},
        }
      }
    }
  },
};
