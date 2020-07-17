import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import {deleteCpInventory , getZCCpInventoryList, deleteCpInventoryOperationItem , getCpInventoryOperationItem, getCpInventory, postCpInventory, postCpAssembly, getCpInventoryList, saveCpAssembly , saveCpInventory, postCpInventoryOperationItem, postCpAssemblyOperationItem } from '../services/api';

export default {
  namespace: 'cpInventory',

  state: {
    getCpInventoryList: {
      list: [],
      pagination: {},
    },
    getCpInventorywllist: {
      list: [],
      pagination: {},
    },
    getCheckCpInStorageFromList: {
      list: [],
      pagination: {},
    },
    cpInStorageFromNotPageList: [],
    cpInStorageFromTreeDataList: [],
    CpInventoryGet: {}
  },

  effects: {

    *delete_CpInventory({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
        const response = yield call(deleteCpInventory, value);
        if (isNotBlank(response) && (response.success === '1' || response.success === 1)) {
          message.success("删除成功");
          if (callback) callback();
        } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
          message.error(response.msg);
        } else if (isNotBlank(response) && (response.success === '0' || response.success === 0)) {
          message.error("删除失败");
        }
      },

    *get_CheckCpInStorageFrom_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getZCCpInventoryList, value);
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
        type: 'getCheckCpInStorageFromList',
        payload: dataMSG,
      });
    },

      *delete_CpInventory_OperationItem({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
        const response = yield call(deleteCpInventoryOperationItem, value);
        if (isNotBlank(response) && (response.success === '1' || response.success === 1)) {
          message.success("删除成功");
          if (callback) callback();
        } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
          message.error(response.msg);
        } else if (isNotBlank(response) && (response.success === '0' || response.success === 0)) {
          message.error("删除失败");
        }
      },

    *get_CpInventory_wllist({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpInventoryOperationItem, value);
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
        type: 'getCpInventorywllist',
        payload: dataMSG,
      });
    },

    *get_pInventory({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpInventory, value);
      if (isNotBlank(response) && isNotBlank(response.data)) {
        if (callback) callback(response);
      }
      yield put({
        type: 'CpInventoryGet',
        payload: response.data,
      });
    },

    *post_CpInventory_OperationItem({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(postCpInventoryOperationItem, value);
      if (isNotBlank(response) && (response.success === '1' || response.success === 1)) {
        message.success("操作成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0)) {
        message.error("操作失败");
      }
    },

    *post_CpAssembly_OperationItem({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(postCpAssemblyOperationItem, value);
      if (isNotBlank(response) && (response.success === '1' || response.success === 1)) {
        message.success("操作成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0)) {
        message.error("操作失败");
      }
    },


    *post_CpInventory({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(postCpInventory, value);
      if (isNotBlank(response) && (response.success === '1' || response.success === 1)) {
        message.success("操作成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0)) {
        message.error("操作失败");
      }
    },


    *save_CpInventory({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(saveCpInventory, value);
      if (isNotBlank(response) && (response.success === '1' || response.success === 1)) {
        message.success("操作成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0)) {
        message.error("操作失败");
      }
    },

    *save_CpAssembly({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(saveCpAssembly, value);
      if (isNotBlank(response) && (response.success === '1' || response.success === 1)) {
        message.success("操作成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0)) {
        message.error("操作失败");
      }
    },




    *post_CpAssembly({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(postCpAssembly, value);
      if (isNotBlank(response) && (response.success === '1' || response.success === 1)) {
        message.success("操作成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0)) {
        message.error("操作失败");
      }
    },




    // *create_Purchase_Detail({ payload, callback }, { call }) {
    //   const value = jsonToFormData(payload);
    //     const response = yield call(createPurchaseDetail , value);
    //     if (isNotBlank(response) && (response.success === '1' || response.success === 1)) {
    //       message.success("添加成功");
    //       if (callback) callback();
    //     } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
    //       message.error(response.msg);
    //     } else if (isNotBlank(response) && (response.success === '0' || response.success === 0)) {
    //       message.error("添加失败");
    //     }
    //   },

    // *cpInStorage_Delete({ payload, callback }, { call }) {
    //   const value = jsonToFormData(payload);
    //     const response = yield call(deleteCpInStorageDetail, value);
    //     if (isNotBlank(response) && (response.success === '1' || response.success === 1)) {
    //       message.success("删除成功");
    //       if (callback) callback();
    //     } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
    //       message.error(response.msg);
    //     } else if (isNotBlank(response) && (response.success === '0' || response.success === 0)) {
    //       message.error("删除失败");
    //     }
    //   },

    *getCpInventory_List({ payload }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCpInventoryList, value);
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
        type: 'getCpInventoryList',
        payload: dataMSG,
      });
    },
    // *cpInStorageFrom_NotPageList({ payload }, { call, put }) {
    //  const value = jsonToFormData(payload);
    //   const response = yield call(listNotPageCpInStorageFrom, value);
    //   let dataMSG = [];
    //   if (isNotBlank(response) && isNotBlank(response.data)) {
    //     dataMSG = response.data;
    //   } else {
    //     dataMSG = [];
    //   }
    //   yield put({
    //     type: 'cpInStorageFromNotPageList',
    //     payload: dataMSG,
    //   });
    // },
    // *cpInStorageFrom_TreeData({ payload }, { call, put }) {
    // const value = jsonToFormData(payload);
    //   const response = yield call(listCpInStorageFromTreeData, value);
    //   let dataMSG = [];
    //   if (isNotBlank(response) && isNotBlank(response.data)) {
    //     dataMSG = response.data;
    //   } else {
    //     dataMSG = [];
    //   }
    //   yield put({
    //     type: 'cpInStorageFromTreeDataList',
    //     payload: dataMSG,
    //   });
    // },
    // *cpInStorageFrom_Add({ payload, callback }, { call }) {
    //   const value = jsonToFormData(payload);
    //   const response = yield call(addCpInStorageFrom, value);
    //   if (isNotBlank(response) && response.success === '1') {
    //     message.success("新增成功");
    //     if (callback) callback();
    //   } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
    //     message.error(response.msg);
    //   } else {
    //     message.error("新增失败");
    //   }
    // },
    // *cpInStorageFrom_save_Add({ payload, callback }, { call }) {
    //   const value = jsonToFormData(payload);
    //   const response = yield call(addCpInStorageFrom, value);
    //   if (isNotBlank(response) && response.success === '1') {
    //     if (callback) callback();
    //   } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
    //     // message.error(response.msg);
    //   } 
    // },
    // *cpInStorageFrom_Update({ payload, callback }, { call }) {
    //   const value = jsonToFormData(payload);
    //   const response = yield call(updateCpInStorageFrom, value);
    //   if (isNotBlank(response) && response.success === '1') {
    //     message.success("修改成功");
    //     if (callback) callback();
    //   } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
    //     message.error(response.msg);
    //   } else {
    //     message.error("修改失败");
    //   }
    // },
    // *cpInStorageFrom_Get({ payload, callback }, { call, put }) {
    // const value = jsonToFormData(payload);
    //   const response = yield call(getCpInStorageFrom, value);
    //   if (isNotBlank(response) && isNotBlank(response.data)) {
    //     if (callback) callback(response);
    //   }
    //   yield put({
    //     type: 'CpInventoryGet',
    //     payload: response.data,
    //   });
    // },
    // *cpInStorageFrom_Delete({ payload, callback }, { call }) {
    // const value = jsonToFormData(payload);
    //   const response = yield call(deleteCpInStorageFrom, value);
    //   if (isNotBlank(response) && (response.success === '1' || response.success === 1)) {
    //     message.success("删除成功");
    //     if (callback) callback();
    //   } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
    //     message.error(response.msg);
    //   } else if (isNotBlank(response) && (response.success === '0' || response.success === 0)) {
    //     message.error("删除失败");
    //   }
    // },
  },
  reducers: {
    getCpInventoryList(state, action) {
      return {
        ...state,
        getCpInventoryList: action.payload,
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
    CpInventoryGet(state, action) {
      return {
        ...state,
        CpInventoryGet: action.payload,
      };
    },
    getCpInventorywllist(state, action) {
      return {
        ...state,
        getCpInventorywllist: action.payload,
      };
    },
    getCheckCpInStorageFromList(state, action) {
      return {
        ...state,
        getCheckCpInStorageFromList: action.payload,
      };
    },
    clear(state) {
      return {
        ...state,
        // getCheckCpInStorageFromList: {
        //   list: [],
        //   pagination: {},
        // },
        getCpInventorywllist: {
          list: [],
          pagination: {},
        },
        // getCpInventoryList: {
        //   list: [],
        //   pagination: {},
        // },
        cpInStorageFromNotPageList: [],
        cpInStorageFromTreeDataList: [],
        CpInventoryGet: {},
      }
    }
  },
};

