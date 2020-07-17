
import { isNotBlank ,jsonToFormData} from '@/utils/utils';

import { listDict } from '../services/api';

export default {
  namespace: 'dict',

  state: {
    dictList: [],
  },

  effects: {
    *dict({ payload,callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(listDict, value);
      let dataMSG = {};
      if (isNotBlank(response)) {
        dataMSG = response;
      } else {
        dataMSG = [];
      }
      if (callback) callback(dataMSG);
      yield put({
        type: 'dictList',
        payload: dataMSG,
      });
    },
  },
  reducers: {
    dictList(state, action) {
      return {
        ...state,
        dictList: action.payload,
      };
    },
    clear() {
      return {
        dictList: [],
      }
    }
  },
};