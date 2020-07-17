import { message } from 'antd';
import { isNotBlank, jsonToFormData } from '@/utils/utils';

import { cpBusinessIntentionupdata,cpAssemblyFormupdate , cpBusinessOrderupdate ,cpAtWorkFormupdate ,cpCarloadConstructionFormupdate ,
  cpPendingSingelFormupdate ,cpSingelFormupdate ,cpOfferFormupdate ,cpDischargedFormupdata , cpAccessoriesWorkFormupdate,
cpAccessoriesAllotupdate ,cpAfterEntrustFromupdate ,cpAfterSgFromupdate ,cpAfterJaFromupdate 
,cpPurchaseFromupdate,cpInStorageFromupdate,cpOutSalesFromupdate ,cpOutStorageFromupdate ,cpQuitFromupdate ,cpZcPurchaseFromupdate,
cpProductupdate,cpProductSalesFromupdate,cpOutProductupdate ,cpProductQuitFromupdate ,cpCostFormupdate ,cpPlantSceneFromupdate } from '../services/api';

export default {
  namespace: 'cpupdata',

  state: {
 
  },

  effects: {
    
    // *cpBusinessOrder_update({ payload, callback }, { call }) {
    //   const value = jsonToFormData(payload);
    //   const response = yield call(cpBusinessOrderupdate, value);
    //   if (isNotBlank(response) && response.success === '1') {
    //     message.success("修改成功");
    //     if (callback) callback();
    //   } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
    //     message.error(response.msg);
    //   } else {
    //     message.error("修改失败");
    //   }
    // },

    *cpPlantSceneFrom_update({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpPlantSceneFromupdate, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("修改成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("修改失败");
      }
    },

    *cpCostForm_update({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpCostFormupdate, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("修改成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("修改失败");
      }
    },

    *cpProductQuitFrom_update({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpProductQuitFromupdate, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("修改成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("修改失败");
      }
    },

    *cpOutProduct_update({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpOutProductupdate, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("修改成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("修改失败");
      }
    },

     *cpProductSalesFrom_update({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpProductSalesFromupdate, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("修改成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("修改失败");
      }
    },

    *cpProduct_update({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpProductupdate, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("修改成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("修改失败");
      }
    },
    
    *cpZcPurchaseFrom_update({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpZcPurchaseFromupdate, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("修改成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("修改失败");
      }
    },

    *cpQuitFrom_update({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpQuitFromupdate, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("修改成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("修改失败");
      }
    },

    *cpOutStorageFrom_update({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpOutStorageFromupdate, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("修改成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("修改失败");
      }
    },

    *cpOutSalesFrom_update({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpOutSalesFromupdate, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("修改成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("修改失败");
      }
    },

    *cpInStorageFrom_update({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpInStorageFromupdate, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("修改成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("修改失败");
      }
    },

    *cpPurchaseFrom_update({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpPurchaseFromupdate, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("修改成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("修改失败");
      }
    },


    *cpAfterJaFrom_update({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpAfterJaFromupdate, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("修改成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("修改失败");
      }
    },

    *cpAfterSgFrom_update({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpAfterSgFromupdate, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("修改成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("修改失败");
      }
    },

    *cpAfterEntrustFrom_update({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpAfterEntrustFromupdate, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("修改成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("修改失败");
      }
    },

    *cpAccessoriesAllot_update({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpAccessoriesAllotupdate, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("修改成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("修改失败");
      }
    },

    *cpAccessoriesWorkForm_update({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpAccessoriesWorkFormupdate, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("修改成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("修改失败");
      }
    },

    *cpDischargedForm_updata({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpDischargedFormupdata, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("修改成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("修改失败");
      }
    },

    *cpOfferForm_update({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpOfferFormupdate, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("修改成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("修改失败");
      }
    },

    *cpSingelForm_update({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpSingelFormupdate, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("修改成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("修改失败");
      }
    },

    *cpPendingSingelForm_update({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpPendingSingelFormupdate, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("修改成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("修改失败");
      }
    },

    *cpCarloadConstructionForm_update({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpCarloadConstructionFormupdate, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("修改成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("修改失败");
      }
    },

    *cpAtWorkForm_update({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpAtWorkFormupdate, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("修改成功");
        if (callback) callback();
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("修改失败");
      }
    },

    *cpBusinessOrder_update({ payload, callback }, { call }) {
        const value = jsonToFormData(payload);
        const response = yield call(cpBusinessOrderupdate, value);
        if (isNotBlank(response) && response.success === '1') {
          message.success("修改成功");
          if (callback) callback();
        } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
          message.error(response.msg);
        } else {
          message.error("修改失败");
        }
      },

    *cpAssemblyForm_update({ payload, callback }, { call }) {
        const value = jsonToFormData(payload);
        const response = yield call(cpAssemblyFormupdate, value);
        if (isNotBlank(response) && response.success === '1') {
          message.success("修改成功");
          if (callback) callback();
        } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
          message.error(response.msg);
        } else {
          message.error("修改失败");
        }
      },

    *cpBusinessIntention_updata({ payload, callback }, { call }) {
      const value = jsonToFormData(payload);
      const response = yield call(cpBusinessIntentionupdata, value);
      if (isNotBlank(response) && response.success === '1') {
        message.success("修改成功");
        if (callback) callback(response);
      } else if (isNotBlank(response) && (response.success === '0' || response.success === 0) && isNotBlank(response.msg)) {
        message.error(response.msg);
      } else {
        message.error("修改失败");
      }
    },
  },
  reducers: {
    
  }
};

