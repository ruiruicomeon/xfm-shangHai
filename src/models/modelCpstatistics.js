import { isNotBlank, jsonToFormData } from '@/utils/utils';
import {
  findTotalOutPutValue,
  findExternalTotalOutPutValue,
  findInternalTotalOutPutValue,
  pjplant,
  zcplant,
  zcCJStatistics,
  pjstatistics,
  zcstatistics,
  cjstatistics,
  findAccessoriesInStock,
  findAssemblyInStock,
  findAccessoriesTwoInStock,
  findAssemblyTwoInStock,
  findCostSummary,
  findTwoCostSummary,
  findGrossProfitMargin,
  getCountBusinessOrderNumber,
  getCountBusinessOrderNumberDay,
  findStatisticsReportProgress,
  findInStorageDetail,
  findOutSalesFromDetail,
  findOutStorageDetail,
  findQuitFromDetail,
  findZCInStorageDetail,
  findZCOutSalesFromDetail,
  findZCOutStorageDetail,
  findZCQuitFromDetail,
  findCgBillMaterialDetail,
  findCgAvgPriceBillMaterialDetail,
  findCgAvgPriceBillMaterialDetailCS,
  findCgAssemblyBuildDetail,
  findCgAvgPriceAssemblyBuildDetail,
  findCgAvgPriceAssemblyBuildDetailCS,
  findMonthCgDueMoneyDetail,
  findMonthCgSupDueMoneyDetail,
  findAccessoriesSalesDetail,
  getTotalValueFigureDrawing,
  getCapacityNumberAndMoney,
  findSalesmanProductionValueGraph,
  findAfterSalesCost,
  getAfterSalesFigureDrawing,
  getAfterGraphDate,
  findAssemblyWxAndXsStatistical,
  getAssemblyWxAndXsGraphDate,
  findCustomerSalesNumber,
  findTotalOutMoneyChange,
  getCustomerSalsesGraphDate,
  findAccessoriesInAndOutAnalyze
} from '../services/api';

export default {
  namespace: 'cpstatistics',

  state: {
    cppjstatisticsList: {
      list: [],
      pagination: {},
    },
    zcstatisticsList: {
      list: [],
      pagination: {},
    },
    cjstatisticsList: {
      list: [],
      pagination: {},
    },
    zcCJStatisticslist: {
      list: [],
      pagination: {},
    },
    pjplantlist: {
      list: [],
      pagination: {},
    },
    zcplantlist: {
      list: [],
      pagination: {},
    },
    findTotalOutPutValueGet: {},
    findtwoTotalOutPutValueGet: {
      list: [],
      pagination: {},
    },
    findExternalTotalOutPutValueGet: {},
    findTwoExternalTotalOutPutValueGet: {
      list: [],
      pagination: {},
    },
    findInternalTotalOutPutValueGet: {},
    findTwoInternalTotalOutPutValueGet: {
      list: [],
      pagination: {},
    },
    findAccessoriesInStocklist: {
      list: [],
      pagination: {},
    },
    findAssemblyInStocklist: {
      list: [],
      pagination: {},
    },
    findAccessoriesTwoInStocklist: {
      list: [],
      pagination: {},
    },
    findAssemblyTwoInStocklist: {
      list: [],
      pagination: {},
    },
    findCostSummarylist: {
      list: [],
      pagination: {},
    },
    findTwoCostSummarylist: {
      list: [],
      pagination: {},
    },
    findGrossProfitMarginlist: {
      list: [],
      pagination: {},
    },
    getCountBusinessOrderNumberGet: {},
    getCountBusinessOrderNumberDayGet: {},
    findStatisticsReportProgresslist: {
      list: [],
      pagination: {},
    },
    findInStorageDetaillist: {
      list: [],
      pagination: {},
    },
    findOutSalesFromDetaillist: {
      list: [],
      pagination: {},
    },
    findOutStorageDetaillist: {
      list: [],
      pagination: {},
    },
    findQuitFromDetaillist: {
      list: [],
      pagination: {},
    },
    findZCInStorageDetaillist: {
      list: [],
      pagination: {},
    },
    findZCOutSalesFromDetaillist: {
      list: [],
      pagination: {},
    },
    findZCOutStorageDetaillist: {
      list: [],
      pagination: {},
    },
    findZCQuitFromDetaillist: {
      list: [],
      pagination: {},
    },
    findCgBillMaterialDetaillist: {
      list: [],
      pagination: {},
    },
    findCgAvgPriceBillMaterialDetaillist: {
      list: [],
      pagination: {},
    },
    findCgAvgPriceBillMaterialDetailCSList: {
      list: [],
      pagination: {},
    },
    findCgAssemblyBuildDetaillist: {
      list: [],
      pagination: {},
    },
    findCgAvgPriceAssemblyBuildDetaillist: {
      list: [],
      pagination: {},
    },
    findCgAvgPriceAssemblyBuildDetailCSList: {
      list: [],
      pagination: {},
    },
    findMonthCgDueMoneyDetaillist: {
      list: [],
      pagination: {},
    },
    findMonthCgSupDueMoneyDetaillist: {
      list: [],
      pagination: {},
    },
    findAccessoriesSalesDetaillist: {
      list: [],
      pagination: {},
    },
    // 总产值曲线图
    findCapacityNumberAndMoneyGet: {},
    // 订单分类统计
    findSalesmanProductionValueGraphOne: {
      list: [],
      pagination: {},
    },
    // 项目分类统计
    findSalesmanProductionValueGraphTwo: {
      list: [],
      pagination: {},
    },
    // 业务渠道统计
    findSalesmanProductionValueGraphThree: {
      list: [],
      pagination: {},
    },
    // 业务分类统计
    findSalesmanProductionValueGraphFour: {
      list: [],
      pagination: {},
    },
    // 售后结案单成本统计
    findAfterSalesCostList: {
      list: [],
      pagination: {},
    },
    // 售后结案单成本统计表饼图
    getAfterSalesFigureDrawing: {},
    // 售后结案单成本统计表曲线图
    getAfterGraphDate: {},
    findAssemblyWxAndXsStatisticalList: {
      list: [],
      pagination: {},
    },
    findAssemblyWxAndXsGraphDate: {},
    findCustomerSalesNumberList: {
      list: [],
      pagination: {},
    },
    // 金额变更后产值表
    findTotalOutMoneyChangeList: {
      list: [],
      pagination: {},
    },
    getCustomerSalsesGraphDate: {},
    findAccessoriesInAndOutAnalyzeData: {
      list: [],
      pagination: {}
    }
  },

  effects: {
    *find_ZCInStorageDetail({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(findZCInStorageDetail, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback();
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'findZCInStorageDetaillist',
        payload: dataMSG,
      });
    },

    *find_ZCOutSalesFromDetail({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(findZCOutSalesFromDetail, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback();
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'findZCOutSalesFromDetaillist',
        payload: dataMSG,
      });
    },

    *find_ZCOutStorageDetail({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(findZCOutStorageDetail, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback();
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'findZCOutStorageDetaillist',
        payload: dataMSG,
      });
    },

    *find_ZCQuitFromDetail({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(findZCQuitFromDetail, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback();
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'findZCQuitFromDetaillist',
        payload: dataMSG,
      });
    },

    *find_OutStorageDetail({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(findOutStorageDetail, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback();
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'findOutStorageDetaillist',
        payload: dataMSG,
      });
    },

    *find_QuitFromDetail({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(findQuitFromDetail, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback();
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'findQuitFromDetaillist',
        payload: dataMSG,
      });
    },

    *find_OutSalesFromDetail({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(findOutSalesFromDetail, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback();
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'findOutSalesFromDetaillist',
        payload: dataMSG,
      });
    },

    *find_InStorageDetail({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(findInStorageDetail, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback();
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'findInStorageDetaillist',
        payload: dataMSG,
      });
    },

    *find_StatisticsReportProgress({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(findStatisticsReportProgress, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback();
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'findStatisticsReportProgresslist',
        payload: dataMSG,
      });
    },

    *get_CountBusinessOrderNumber({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCountBusinessOrderNumber, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback(response.data);
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'getCountBusinessOrderNumberGet',
        payload: dataMSG,
      });
    },

    *get_CountBusinessOrderNumberDay({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCountBusinessOrderNumberDay, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback();
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'getCountBusinessOrderNumberDayGet',
        payload: dataMSG,
      });
    },

    *find_GrossProfitMargin({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(findGrossProfitMargin, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback();
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'findGrossProfitMarginlist',
        payload: dataMSG,
      });
    },

    *find_CostSummary({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(findCostSummary, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback();
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'findCostSummarylist',
        payload: dataMSG,
      });
    },

    *find_TwoCostSummary({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(findTwoCostSummary, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback();
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'findTwoCostSummarylist',
        payload: dataMSG,
      });
    },

    *find_AccessoriesTwoInStock({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(findAccessoriesTwoInStock, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback();
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'findAccessoriesTwoInStocklist',
        payload: dataMSG,
      });
    },

    *find_AssemblyTwoInStock({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(findAssemblyTwoInStock, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback();
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'findAssemblyTwoInStocklist',
        payload: dataMSG,
      });
    },

    *find_AccessoriesInStock({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(findAccessoriesInStock, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback();
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'findAccessoriesInStocklist',
        payload: dataMSG,
      });
    },

    *find_AssemblyInStock({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(findAssemblyInStock, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback();
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'findAssemblyInStocklist',
        payload: dataMSG,
      });
    },

    // 内部饼图
    // *find_InternalTotalOutPutValue({ payload, callback }, { call, put }) {
    //   const value = jsonToFormData(payload);
    //   const response = yield call(findInternalTotalOutPutValue, value);
    //   let dataMSG = {};
    //   if (isNotBlank(response) && isNotBlank(response.data)) {
    //     dataMSG = response.data;
    //     if (callback) callback(response.data);
    //   } else {
    //     dataMSG = {};
    //   }
    //   yield put({
    //     type: 'findInternalTotalOutPutValueGet',
    //     payload: dataMSG,
    //   });
    // },
    // 内部产值表
    *find_InternalTotalOutPutValue_two({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(findInternalTotalOutPutValue, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback();
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'findTwoInternalTotalOutPutValueGet',
        payload: dataMSG,
      });
    },

    // // 外部饼图
    // *find_ExternalTotalOutPutValue({ payload, callback }, { call, put }) {
    //   const value = jsonToFormData(payload);
    //   const response = yield call(findExternalTotalOutPutValue, value);
    //   let dataMSG = {};
    //   if (isNotBlank(response) && isNotBlank(response.success) && response.success == 1) {
    //     dataMSG = isNotBlank(response.data) ? response.data : {};
    //     if (callback) callback(dataMSG);
    //   } else {
    //     dataMSG = {};
    //   }
    //   yield put({
    //     type: 'findExternalTotalOutPutValueGet',
    //     payload: dataMSG,
    //   });
    // },

    // 外部产值列表
    *find_ExternalTotalOutPutValue_two({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(findExternalTotalOutPutValue, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback();
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'findTwoExternalTotalOutPutValueGet',
        payload: dataMSG,
      });
    },

    // // 总产值饼图
    // *find_TotalOutPutValue({ payload, callback }, { call, put }) {
    //   const value = jsonToFormData(payload);
    //   const response = yield call(findTotalOutPutValue, value);
    //   let dataMSG = {};
    //   if (
    //     isNotBlank(response) &&
    //     isNotBlank(response.success) &&
    //     (response.success === 1 || response.success === '1')
    //   ) {
    //     dataMSG = isNotBlank(response.data) ? response.data : {};
    //     if (callback) callback(dataMSG);
    //   } else {
    //     dataMSG = {};
    //   }
    //   yield put({
    //     type: 'findTotalOutPutValueGet',
    //     payload: dataMSG,
    //   });
    // },

    // 总产值/外部/内部饼图
    *find_TotalOutPutValue({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getTotalValueFigureDrawing, value);
      let dataMSG = {};
      if (
        isNotBlank(response) &&
        isNotBlank(response.success) &&
        (response.success === 1 || response.success === '1')
      ) {
        dataMSG = isNotBlank(response.data) ? response.data : {};
        if (callback) callback(dataMSG);
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'findTotalOutPutValueGet',
        payload: dataMSG,
      });
    },

    // 总产值/外部产值/内部产值曲线图
    *get_CapacityNumberAndMoney({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCapacityNumberAndMoney, value);
      let dataMSG = {};
      if (
        isNotBlank(response) &&
        isNotBlank(response.success) &&
        (response.success === 1 || response.success === '1')
      ) {
        dataMSG = isNotBlank(response.data) ? response.data : {};
        if (callback) callback(dataMSG);
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'findCapacityNumberAndMoneyGet',
        payload: dataMSG,
      });
    },

    // *find_TotalOutPutValue_two({ payload, callback }, { call, put }) {
    //   const value = jsonToFormData(payload);
    //   const response = yield call(findTotalOutPutValue, value);
    //   let dataMSG = {};
    //   if (isNotBlank(response) && isNotBlank(response.data)) {
    //     dataMSG = response.data;
    //     if (callback) callback(response.data);
    //   } else {
    //     dataMSG = {};
    //   }
    //   yield put({
    //     type: 'findtwoTotalOutPutValueGet',
    //     payload: dataMSG,
    //   });
    // },
    // 总产值报表
    *find_TotalOutPutValue_two({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(findTotalOutPutValue, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback(response.data);
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'findtwoTotalOutPutValueGet',
        payload: dataMSG,
      });
    },

    *get_pj_plant({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(pjplant, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback();
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'pjplantlist',
        payload: dataMSG,
      });
    },

    *get_zc_plant({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(zcplant, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback();
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'zcplantlist',
        payload: dataMSG,
      });
    },

    *zcCJ_Statistics({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(zcCJStatistics, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback();
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'zcCJStatisticslist',
        payload: dataMSG,
      });
    },

    *zcstatistics_List({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(zcstatistics, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback();
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'zcstatisticsList',
        payload: dataMSG,
      });
    },

    *cjstatistics_List({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(cjstatistics, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback();
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'cjstatisticsList',
        payload: dataMSG,
      });
    },
    *cppjstatistics_List({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(pjstatistics, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback();
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'cppjstatisticsList',
        payload: dataMSG,
      });
    },

    // 供应商采购明细表
    *find_CgBillMaterialDetail({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(findCgBillMaterialDetail, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback();
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'findCgBillMaterialDetaillist',
        payload: dataMSG,
      });
    },
    // 供应商采购明细表
    *find_CgAvgPriceBillMaterialDetail({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(findCgAvgPriceBillMaterialDetail, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback();
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'findCgAvgPriceBillMaterialDetaillist',
        payload: dataMSG,
      });
    },

    // 供应商月度采购分析表
    *find_CgAvgPriceBillMaterialDetailCS({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(findCgAvgPriceBillMaterialDetailCS, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback();
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'findCgAvgPriceBillMaterialDetailCSList',
        payload: dataMSG,
      });
    },
    // 供应商总成采购明细表
    *find_CgAssemblyBuildDetail({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(findCgAssemblyBuildDetail, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback();
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'findCgAssemblyBuildDetaillist',
        payload: dataMSG,
      });
    },
    // 分公司总成采购月度分析表
    *find_CgAvgPriceAssemblyBuildDetail({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(findCgAvgPriceAssemblyBuildDetail, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback();
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'findCgAvgPriceAssemblyBuildDetaillist',
        payload: dataMSG,
      });
    },

    // 总成采购总成月度分析表(供应商)
    *find_CgAvgPriceAssemblyBuildDetailCS({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(findCgAvgPriceAssemblyBuildDetailCS, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback();
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'findCgAvgPriceAssemblyBuildDetailCSList',
        payload: dataMSG,
      });
    },

    // 月度采购应付款明细表
    *find_MonthCgDueMoneyDetail({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(findMonthCgDueMoneyDetail, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback();
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'findMonthCgDueMoneyDetaillist',
        payload: dataMSG,
      });
    },

    // 月度供应商应付款汇总表
    *find_MonthCgSupDueMoneyDetail({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(findMonthCgSupDueMoneyDetail, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback();
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'findMonthCgSupDueMoneyDetaillist',
        payload: dataMSG,
      });
    },

    // 配件销售明细利润表
    *find_AccessoriesSalesDetail({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(findAccessoriesSalesDetail, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback();
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'findAccessoriesSalesDetaillist',
        payload: dataMSG,
      });
    },

    // 订单分类统计
    *find_SalesmanProductionValueGraphOne({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(findSalesmanProductionValueGraph, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback();
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'findSalesmanProductionValueGraphOne',
        payload: dataMSG,
      });
    },

    // 项目分类统计
    *find_SalesmanProductionValueGraphTwo({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(findSalesmanProductionValueGraph, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback();
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'findSalesmanProductionValueGraphTwo',
        payload: dataMSG,
      });
    },

    // 业务渠道统计
    *find_SalesmanProductionValueGraphThree({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(findSalesmanProductionValueGraph, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback();
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'findSalesmanProductionValueGraphThree',
        payload: dataMSG,
      });
    },

    // 业务分类统计
    *find_SalesmanProductionValueGraphFour({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(findSalesmanProductionValueGraph, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback();
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'findSalesmanProductionValueGraphFour',
        payload: dataMSG,
      });
    },

    // 售后结案单成本统计
    *find_AfterSalesCost({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(findAfterSalesCost, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback();
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'findAfterSalesCostList',
        payload: dataMSG,
      });
    },

    // 售后结案单成本统计饼图
    *get_AfterSalesFigureDrawing({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getAfterSalesFigureDrawing, value);
      let dataMSG = {};
      if (
        isNotBlank(response) &&
        isNotBlank(response.success) &&
        (response.success === 1 || response.success === '1')
      ) {
        dataMSG = isNotBlank(response.data) ? response.data : {};
        if (callback) callback(dataMSG);
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'getAfterSalesFigureDrawing',
        payload: dataMSG,
      });
    },

    // 售后结案单成本统计曲线图
    *get_AfterGraphDate({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getAfterGraphDate, value);
      let dataMSG = {};
      if (
        isNotBlank(response) &&
        isNotBlank(response.success) &&
        (response.success === 1 || response.success === '1')
      ) {
        dataMSG = isNotBlank(response.data) ? response.data : {};
        if (callback) callback(dataMSG);
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'getAfterGraphDate',
        payload: dataMSG,
      });
    },

    // 总成维修销售统计表
    *find_AssemblyWxAndXsStatistical({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(findAssemblyWxAndXsStatistical, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback();
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'findAssemblyWxAndXsStatisticalList',
        payload: dataMSG,
      });
    },

    // 总成维修销售统计曲线图
    *get_AssemblyWxAndXsGraphDate({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getAssemblyWxAndXsGraphDate, value);
      let dataMSG = {};
      if (
        isNotBlank(response) &&
        isNotBlank(response.success) &&
        (response.success === 1 || response.success === '1')
      ) {
        dataMSG = isNotBlank(response.data) ? response.data : {};
        if (callback) callback(dataMSG);
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'findAssemblyWxAndXsGraphDate',
        payload: dataMSG,
      });
    },

    // 客户曲线图
    *get_CustomerSalsesGraphDate({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(getCustomerSalsesGraphDate, value);
      let dataMSG = {};
      if (
        isNotBlank(response) &&
        isNotBlank(response.success) &&
        (response.success === 1 || response.success === '1')
      ) {
        dataMSG = isNotBlank(response.data) ? response.data : {};
        if (callback) callback(dataMSG);
      } else {
        dataMSG = {};
      }
      yield put({
        type: 'getCustomerSalsesGraphDate',
        payload: dataMSG,
      });
    },

    // 客户统计分析表
    *find_CustomerSalesNumber({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(findCustomerSalesNumber, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback();
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'findCustomerSalesNumberList',
        payload: dataMSG,
      });
    },

    // 金额变更后产值表
    *find_TotalOutMoneyChange({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(findTotalOutMoneyChange, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback();
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'findTotalOutMoneyChangeList',
        payload: dataMSG,
      });
    },
    // 配件出入库统计分析
    *find_AccessoriesInAndOutAnalyze({ payload, callback }, { call, put }) {
      const value = jsonToFormData(payload);
      const response = yield call(findAccessoriesInAndOutAnalyze, value);
      let dataMSG = {};
      if (isNotBlank(response) && isNotBlank(response.data)) {
        dataMSG = response.data;
        if (callback) callback();
      } else {
        dataMSG = {
          list: [],
          pagination: {},
        };
      }
      yield put({
        type: 'save_AccessoriesInAndOutAnalyze',
        payload: dataMSG,
      });
    },
  },


  reducers: {
    findTotalOutMoneyChangeList(state, action) {
      return {
        ...state,
        findTotalOutMoneyChangeList: action.payload,
      };
    },
    findCustomerSalesNumberList(state, action) {
      return {
        ...state,
        findCustomerSalesNumberList: action.payload,
      };
    },
    findAssemblyWxAndXsGraphDate(state, action) {
      return {
        ...state,
        findAssemblyWxAndXsGraphDate: action.payload,
      };
    },
    findAssemblyWxAndXsStatisticalList(state, action) {
      return {
        ...state,
        findAssemblyWxAndXsStatisticalList: action.payload,
      };
    },
    getAfterGraphDate(state, action) {
      return {
        ...state,
        getAfterGraphDate: action.payload,
      };
    },
    getAfterSalesFigureDrawing(state, action) {
      return {
        ...state,
        getAfterSalesFigureDrawing: action.payload,
      };
    },
    findAfterSalesCostList(state, action) {
      return {
        ...state,
        findAfterSalesCostList: action.payload,
      };
    },
    findSalesmanProductionValueGraphOne(state, action) {
      return {
        ...state,
        findSalesmanProductionValueGraphOne: action.payload,
      };
    },
    findSalesmanProductionValueGraphTwo(state, action) {
      return {
        ...state,
        findSalesmanProductionValueGraphTwo: action.payload,
      };
    },
    findSalesmanProductionValueGraphThree(state, action) {
      return {
        ...state,
        findSalesmanProductionValueGraphThree: action.payload,
      };
    },
    findSalesmanProductionValueGraphFour(state, action) {
      return {
        ...state,
        findSalesmanProductionValueGraphFour: action.payload,
      };
    },
    findCapacityNumberAndMoneyGet(state, action) {
      return {
        ...state,
        findCapacityNumberAndMoneyGet: action.payload,
      };
    },
    findAccessoriesSalesDetaillist(state, action) {
      return {
        ...state,
        findAccessoriesSalesDetaillist: action.payload,
      };
    },
    findMonthCgSupDueMoneyDetaillist(state, action) {
      return {
        ...state,
        findMonthCgSupDueMoneyDetaillist: action.payload,
      };
    },
    findMonthCgDueMoneyDetaillist(state, action) {
      return {
        ...state,
        findMonthCgDueMoneyDetaillist: action.payload,
      };
    },
    findCgAvgPriceAssemblyBuildDetailCSList(state, action) {
      return {
        ...state,
        findCgAvgPriceAssemblyBuildDetailCSList: action.payload,
      };
    },
    findCgAvgPriceAssemblyBuildDetaillist(state, action) {
      return {
        ...state,
        findCgAvgPriceAssemblyBuildDetaillist: action.payload,
      };
    },
    findCgAssemblyBuildDetaillist(state, action) {
      return {
        ...state,
        findCgAssemblyBuildDetaillist: action.payload,
      };
    },
    findCgAvgPriceBillMaterialDetailCSList(state, action) {
      return {
        ...state,
        findCgAvgPriceBillMaterialDetailCSList: action.payload,
      };
    },
    findCgAvgPriceBillMaterialDetaillist(state, action) {
      return {
        ...state,
        findCgAvgPriceBillMaterialDetaillist: action.payload,
      };
    },
    findCgBillMaterialDetaillist(state, action) {
      return {
        ...state,
        findCgBillMaterialDetaillist: action.payload,
      };
    },
    cjstatisticsList(state, action) {
      return {
        ...state,
        cjstatisticsList: action.payload,
      };
    },
    cppjstatisticsList(state, action) {
      return {
        ...state,
        cppjstatisticsList: action.payload,
      };
    },
    zcstatisticsList(state, action) {
      return {
        ...state,
        zcstatisticsList: action.payload,
      };
    },
    zcCJStatisticslist(state, action) {
      return {
        ...state,
        zcCJStatisticslist: action.payload,
      };
    },
    pjplantlist(state, action) {
      return {
        ...state,
        pjplantlist: action.payload,
      };
    },
    zcplantlist(state, action) {
      return {
        ...state,
        zcplantlist: action.payload,
      };
    },
    findTotalOutPutValueGet(state, action) {
      return {
        ...state,
        findTotalOutPutValueGet: action.payload,
      };
    },
    findExternalTotalOutPutValueGet(state, action) {
      return {
        ...state,
        findExternalTotalOutPutValueGet: action.payload,
      };
    },
    findTwoExternalTotalOutPutValueGet(state, action) {
      return {
        ...state,
        findTwoExternalTotalOutPutValueGet: action.payload,
      };
    },
    findInternalTotalOutPutValueGet(state, action) {
      return {
        ...state,
        findInternalTotalOutPutValueGet: action.payload,
      };
    },
    findTwoInternalTotalOutPutValueGet(state, action) {
      return {
        ...state,
        findTwoInternalTotalOutPutValueGet: action.payload,
      };
    },
    findAccessoriesInStocklist(state, action) {
      return {
        ...state,
        findAccessoriesInStocklist: action.payload,
      };
    },
    findAssemblyInStocklist(state, action) {
      return {
        ...state,
        findAssemblyInStocklist: action.payload,
      };
    },
    findAccessoriesTwoInStocklist(state, action) {
      return {
        ...state,
        findAccessoriesTwoInStocklist: action.payload,
      };
    },
    findAssemblyTwoInStocklist(state, action) {
      return {
        ...state,
        findAssemblyTwoInStocklist: action.payload,
      };
    },
    findCostSummarylist(state, action) {
      return {
        ...state,
        findCostSummarylist: action.payload,
      };
    },
    findTwoCostSummarylist(state, action) {
      return {
        ...state,
        findTwoCostSummarylist: action.payload,
      };
    },
    findGrossProfitMarginlist(state, action) {
      return {
        ...state,
        findGrossProfitMarginlist: action.payload,
      };
    },
    getCountBusinessOrderNumberGet(state, action) {
      return {
        ...state,
        getCountBusinessOrderNumberGet: action.payload,
      };
    },
    getCountBusinessOrderNumberDayGet(state, action) {
      return {
        ...state,
        getCountBusinessOrderNumberDayGet: action.payload,
      };
    },
    findStatisticsReportProgresslist(state, action) {
      return {
        ...state,
        findStatisticsReportProgresslist: action.payload,
      };
    },
    findInStorageDetaillist(state, action) {
      return {
        ...state,
        findInStorageDetaillist: action.payload,
      };
    },
    findOutSalesFromDetaillist(state, action) {
      return {
        ...state,
        findOutSalesFromDetaillist: action.payload,
      };
    },
    findOutStorageDetaillist(state, action) {
      return {
        ...state,
        findOutStorageDetaillist: action.payload,
      };
    },
    findQuitFromDetaillist(state, action) {
      return {
        ...state,
        findQuitFromDetaillist: action.payload,
      };
    },
    findZCInStorageDetaillist(state, action) {
      return {
        ...state,
        findZCInStorageDetaillist: action.payload,
      };
    },
    findZCOutSalesFromDetaillist(state, action) {
      return {
        ...state,
        findZCOutSalesFromDetaillist: action.payload,
      };
    },
    findZCOutStorageDetaillist(state, action) {
      return {
        ...state,
        findZCOutStorageDetaillist: action.payload,
      };
    },
    findZCQuitFromDetaillist(state, action) {
      return {
        ...state,
        findZCQuitFromDetaillist: action.payload,
      };
    },
    findtwoTotalOutPutValueGet(state, action) {
      return {
        ...state,
        findtwoTotalOutPutValueGet: action.payload,
      };
    },
    getCustomerSalsesGraphDate(state, action) {
      return {
        ...state,
        getCustomerSalsesGraphDate: action.payload,
      };
    },
    save_AccessoriesInAndOutAnalyze(state, action) {
      return {
        ...state,
        findAccessoriesInAndOutAnalyzeData: action.payload,
      };
    },

    clear() {
      return {
        findAfterSalesCostList: {
          list: [],
          pagination: {},
        },
        findSalesmanProductionValueGraphOne: {
          list: [],
          pagination: {},
        },
        findSalesmanProductionValueGraphTwo: {
          list: [],
          pagination: {},
        },
        findSalesmanProductionValueGraphThree: {
          list: [],
          pagination: {},
        },
        findSalesmanProductionValueGraphFour: {
          list: [],
          pagination: {},
        },
        findtwoTotalOutPutValueGet: {
          list: [],
          pagination: {},
        },
        findZCInStorageDetaillist: {
          list: [],
          pagination: {},
        },
        findZCOutSalesFromDetaillist: {
          list: [],
          pagination: {},
        },
        findZCOutStorageDetaillist: {
          list: [],
          pagination: {},
        },
        findZCQuitFromDetaillist: {
          list: [],
          pagination: {},
        },

        findQuitFromDetaillist: {
          list: [],
          pagination: {},
        },
        findOutStorageDetaillist: {
          list: [],
          pagination: {},
        },
        findOutSalesFromDetaillist: {
          list: [],
          pagination: {},
        },
        findInStorageDetaillist: {
          list: [],
          pagination: {},
        },
        findStatisticsReportProgresslist: {
          list: [],
          pagination: {},
        },
        getCountBusinessOrderNumberGet: {},
        getCountBusinessOrderNumberDayGet: {},
        findGrossProfitMarginlist: {
          list: [],
          pagination: {},
        },
        findTwoCostSummarylist: {
          list: [],
          pagination: {},
        },
        findCostSummarylist: {
          list: [],
          pagination: {},
        },
        findAssemblyTwoInStocklist: {
          list: [],
          pagination: {},
        },
        findAccessoriesTwoInStocklist: {
          list: [],
          pagination: {},
        },
        findAccessoriesInStocklist: {
          list: [],
          pagination: {},
        },
        findAssemblyInStocklist: {
          list: [],
          pagination: {},
        },
        findInternalTotalOutPutValueGet: {},
        findTwoInternalTotalOutPutValueGet: {
          list: [],
          pagination: {},
        },
        findExternalTotalOutPutValueGet: {},
        findTwoExternalTotalOutPutValueGet: {
          list: [],
          pagination: {},
        },
        findTotalOutPutValueGet: {},
        zcplantlist: {
          list: [],
          pagination: {},
        },
        pjplantlist: {
          list: [],
          pagination: {},
        },
        zcCJStatisticslist: {
          list: [],
          pagination: {},
        },
        cjstatisticsList: {
          list: [],
          pagination: {},
        },
        zcstatisticsList: {
          list: [],
          pagination: {},
        },
        cppjstatisticsList: {
          list: [],
          pagination: {},
        },
        findCgBillMaterialDetaillist: {
          list: [],
          pagination: {},
        },
        findCgAvgPriceBillMaterialDetaillist: {
          list: [],
          pagination: {},
        },
        findCgAvgPriceBillMaterialDetailCSList: {
          list: [],
          pagination: {},
        },
        findCgAssemblyBuildDetaillist: {
          list: [],
          pagination: {},
        },
        findCgAvgPriceAssemblyBuildDetaillist: {
          list: [],
          pagination: {},
        },
        findCgAvgPriceAssemblyBuildDetailCSList: {
          list: [],
          pagination: {},
        },
        findMonthCgDueMoneyDetaillist: {
          list: [],
          pagination: {},
        },
        findMonthCgSupDueMoneyDetaillist: {
          list: [],
          pagination: {},
        },
        findAccessoriesSalesDetaillist: {
          list: [],
          pagination: {},
        },
        findCapacityNumberAndMoneyGet: {},
        getAfterSalesFigureDrawing: {},
        getAfterGraphDate: {},
        findAssemblyWxAndXsStatisticalList: {
          list: [],
          pagination: {},
        },
        findAssemblyWxAndXsGraphDate: {},
        findCustomerSalesNumberList: {
          list: [],
          pagination: {},
        },
        findTotalOutMoneyChangeList: {
          list: [],
          pagination: {},
        },
      };
    },
  },
};
