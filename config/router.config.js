export default [
  {
    path: '/bom_query_out',
    name: 'BomQueryOut',
    component: './print/BomQueryOut',
  },
  {
    path: '/cp_billMaterialList_new_out',
    name: 'CpBillMaterialListNewOut',
    component: './print/CpBillMaterialListNewOut',
  },
  {
    path: '/information_inquiry_Out',
    name: 'InformationInquiryOut',
    component: './print/InformationInquiryOut',
  },

  {
    path: '/zc_madeUp_PutStorage',
    name: 'zc_madeUp_PutStorage',
    component: './print/zc_madeUp_PutStorage',
  },

  {
    path: '/zc_madeUp_OutStorage',
    name: 'zc_madeUp_OutStorage',
    component: './print/zc_madeUp_OutStorage',
  },

  {
    path: '/zc_madeUp_MaterialReturn',
    name: 'zc_madeUp_MaterialReturn',
    component: './print/zc_madeUp_MaterialReturn',
  },

  {
    path: '/zc_madeUp_GoodsReturn',
    name: 'zc_madeUp_GoodsReturn',
    component: './print/zc_madeUp_GoodsReturn',
  },

  {
    path: '/StartInvoicePrint',
    name: 'StartInvoicePrint',
    component: './print/StartInvoicePrint',
  },

  {
    path: '/cpMoneyChangeprint',
    name: 'cpMoneyChangeprint',
    component: './print/cpMoneyChangeprint',
  },

  {
    path: '/cpQualityCardprint',
    name: 'cpQualityCardprint',
    component: './print/cpQualityCardprint',
  },

  {
    path: '/AccessoriesSalesprint',
    name: 'AccessoriesSalesprint',
    component: './print/Accessories_sales_print',
  },

  {
    path: '/businessintentionprint',
    name: 'businessintentionprint',
    component: './print/businessintentionprint',
  },
  {
    path: '/TaskBusinessDelegate',
    name: 'TaskBusinessDelegate',
    component: './print/TaskBusinessDelegate',
  },
  {
    path: '/Task_At_Construction',
    name: 'Task_At_Construction',
    component: './print/Task_At_Construction',
  },
  {
    path: '/Task_Zc_Construction',
    name: 'Task_Zc_Construction',
    component: './print/Task_Zc_Construction',
  },
  { path: '/Task_PriceSheet', name: 'Task_PriceSheet', component: './print/Task_PriceSheet' },
  {
    path: '/Task_ReleasePermit',
    name: 'Task_ReleasePermit',
    component: './print/Task_ReleasePermit',
  },
  {
    path: '/Task_FinalStatement',
    name: 'Task_FinalStatement',
    component: './print/Task_FinalStatement',
  },
  {
    path: '/Parts_PurchaseOrder',
    name: 'Parts_PurchaseOrder',
    component: './print/Parts_PurchaseOrder',
  },
  {
    path: '/Parts_ZC_PurchaseOrder',
    name: 'Parts_ZC_PurchaseOrder',
    component: './print/Parts_ZC_PurchaseOrder',
  },
  {
    path: '/Parts_SG_PurchaseOrder',
    name: 'Parts_SG_PurchaseOrder',
    component: './print/Parts_SG_PurchaseOrder',
  },
  {
    path: '/madeUp_PutStorage',
    name: 'madeUp_PutStorage',
    component: './print/madeUp_PutStorage',
  },
  {
    path: '/madeUp_OutStorage',
    name: 'madeUp_OutStorage',
    component: './print/madeUp_OutStorage',
  },
  {
    path: '/madeUp_DisconnentPutStorage',
    name: 'madeUp_DisconnentPutStorage',
    component: './print/madeUp_DisconnentPutStorage',
  },
  {
    path: '/madeUp_MaterialReturn',
    name: 'madeUp_MaterialReturn',
    component: './print/madeUp_MaterialReturn',
  },
  {
    path: '/madeUp_GoodsReturn', // 退货单
    name: 'madeUp_GoodsReturn',
    component: './print/madeUp_GoodsReturn',
  },
  {
    path: '/jobmanage_ToQuote',
    name: 'jobmanage_ToQuote',
    component: './print/jobmanage_ToQuote',
  },
  {
    path: '/aftersale_EntrustOrder',
    name: 'aftersale_EntrustOrder',
    component: './print/aftersale_EntrustOrder',
  },
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
      { path: '/user/register', name: 'register', component: './User/Register' },
      {
        path: '/user/register-result',
        name: 'register.result',
        component: './User/RegisterResult',
      },
      {
        component: '404',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    hideInMenu: true,
    routes: [
      { path: '/', redirect: '/monthly_statistics' },
      {
        path: '/monthly_statistics',
        name: 'monthly_statistics',
        icon: 'monthly_statistics',
        component: './ERP/MonthlyStatistics',
      },
      // {
      //   path: '/',
      //   redirect: '/index',
      // },
      // { path: '/index',  component: './ERP/Index' ,hideInMenu: true},
      {
        path: '/calendar',
        name: 'calendar',
        icon: 'basic',
        component: './ERP/calendar',
        // icon: 'calendar',
        // hideInMenu: true,
        routes: [
        ]
      },
      {
        name: 'enhance',
        icon: 'star',
        path: '/enhance',
        hideInMenu: true,
        routes: [
          {
            path: '/enhance/curd-page',
            name: 'curdPage',
            component: './Enhance/CurdPage',
          },
          {
            path: '/enhance/curd-custom-page',
            name: 'curdCustomPage',
            component: './Enhance/CurdCustomPage',
          },
        ],
      },

      {
        path: '/basic',
        name: 'basic',
        icon: 'basic',
        authority: ['dict', 'area', 'office', 'dept'],
        routes: [
          {
            path: '/basic/area_list',
            name: 'area_list',
            component: './ERP/SysArea',
            authority: ['dict'],
          },
          {
            path: '/basic/company_list',
            name: 'company_list',
            component: './ERP/CompanyUserList',
            authority: ['office'],
          },
          {
            path: '/basic/department_list',
            name: 'department_list',
            component: './ERP/DepartmentUserList',
            authority: ['dept'],
          },
          {
            path: '/basic/shierarchy_List',
            name: 'shierarchy_List',
            component: './ERP/ShierarchyUserList',
            authority: ['area'],
          },
          {
            path: '/basic/company_form',
            name: 'company_form',
            component: './ERP/CompanyForm',
            hideInMenu: true,
            authority: ['office'],
          },
          // {
          //   path: '/basic/report',
          //   name: 'report',
          //   // component: './ERP/CompanyForm',
          //   routes:[
          //   ]
          // }
        ]
      },
      // start
      {
        path: '/system',
        name: 'system',
        icon: 'system',
        authority: ['role', 'user', 'menu', 'dict'],
        routes: [
          // {
          //   path: '/system/user_list',
          //   name: 'user_list',
          //   component: './ERP/SysUserList',
          // },
          {
            path: '/system/role_list',
            name: 'role_list',
            component: './ERP/SysRoleList',
            authority: ['role'],
          },
          {
            path: '/system/user_list',
            name: 'user_list',
            component: './ERP/SysUserList',
            authority: ['user'],
          },
          {
            path: '/system/sys_user_form',
            name: 'sys_user_form',
            component: './ERP/SysUserForm',
            hideInMenu: true,
            authority: ['user'],
          },
          {
            path: '/system/sys-role/form',
            component: './ERP/SysRoleForm',
            authority: ['role'],
          },
          {
            path: '/system/menu_list',
            name: 'menu_list',
            component: './ERP/MenuList',
            authority: ['menu'],
          },
          {
            path: '/system/dictionary_list',
            name: 'dictionary_list',
            component: './ERP/DictionaryList',
            authority: ['dict'],
          },
        ]
      },

      {
        path: '/basicManagement',
        name: 'basicManagement',
        icon: 'basicManagement',
        authority: ['cpClient', 'cpAssemblyBuild', 'cpCollecClient', 'cpBillMaterial', 'cpOneCode', 'cpTwoCode', 'CpEntrepot', 'CpStorage', 'cpPjEntrepot', 'cpPjStorage', 'cpSupplierAudit', 'cpSupplier'],
        routes: [
          {
            path: '/basicManagement/basis/cp_history_client_list',
            name: 'cp_history_client_list',
            component: './ERP/CpClientListHistory',
            authority: ['CH'],
          },
          {
            path: '/basicManagement/basis/cp_client_form',
            name: 'cp_client_form',
            component: './ERP/CpClientForm',
            authority: ['cpClient'],
            hideInMenu: true,
          },
          {
            path: '/basicManagement/basis/cp_client_list',
            name: 'cp_client_list',
            component: './ERP/CpClientList',
            authority: ['cpClient'],
          },
          {
            path: '/basicManagement/basis/cp_assembly_build_list',
            name: 'cp_assembly_build_list',
            component: './ERP/CpAssemblyBuildList',
            authority: ['cpAssemblyBuild'],
          },
          {
            path: '/basicManagement/basis/cp_assembly_build_form',
            name: 'cp_assembly_build_form',
            component: './ERP/CpAssemblyBuildForm',
            authority: ['cpAssemblyBuild'],
            hideInMenu: true
          },
          {
            path: '/basicManagement/basis/cp_collec_client_list',
            name: 'cp_collec_client_list',
            component: './ERP/CpCollecClientList',
            authority: ['cpCollecClient'],
          },
          {
            path: '/basicManagement/basis/cp_collec_client_form',
            name: 'cp_collec_client_form',
            component: './ERP/CpCollecClientForm',
            authority: ['cpCollecClient'],
            hideInMenu: true
          },
          // {
          //   path: '/basicManagement/basis/cp_collec_Code_list',
          //   name: 'cp_collec_Code_list',
          //   component: './ERP/CpCollecCodeList',
          //   authority: ['cpCollecClient'],
          // },
          // {
          //   path: '/basicManagement/basis/cp_collec_Code_form',
          //   name: 'cp_collec_Code_form',
          //   component: './ERP/CpCollecCodeForm',
          //   authority: ['cpCollecClient'],
          //   hideInMenu: true
          // },
          {
            path: '/basicManagement/basis/add_announcement',
            name: 'add_announcement',
            component: './ERP/AddAnnouncement',
            authority: ['doc'],
          },
          {
            path: '/basicManagement/materials',
            name: 'materials',
            icon: 'materials',
            authority: ['cpBillMaterial', 'cpOneCode', 'cpTwoCode'],
            routes: [
              {
                path: '/basicManagement/materials/cp_bill_material_list',
                name: 'cp_bill_material_list',
                component: './ERP/CpBillMaterialList',
                authority: ['cpBillMaterial'],
              },
              {
                path: '/basicManagement/materials/cp_bill_material_form',
                name: 'cp_bill_material_form',
                component: './ERP/cpBillMaterialForm',
                authority: ['cpBillMaterial'],
                hideInMenu: true
              },
              {
                path: '/basicManagement/materials/cp_one_code_list',
                name: 'cp_one_code_list',
                component: './ERP/CpOneCodeList',
                authority: ['cpOneCode'],
              },
              {
                path: '/basicManagement/materials/cp_one_code_form',
                name: 'cp_one_code_form',
                component: './ERP/CpOneCodeForm',
                authority: ['cpOneCode'],
                hideInMenu: true
              },
              {
                path: '/basicManagement/materials/cp_two_code_list',
                name: 'cp_two_code_list',
                component: './ERP/CpTwoCodeList',
                authority: ['cpTwoCode'],
              },
              {
                path: '/basicManagement/materials/cp_two_code_form',
                name: 'cp_two_code_form',
                component: './ERP/CpTwoCodeForm',
                authority: ['cpTwoCode'],
                hideInMenu: true
              }
            ]
          },

          {
            path: '/basicManagement/warehouse',
            name: 'warehouse',
            icon: 'warehouse',
            authority: ['CpEntrepot', 'CpStorage', 'cpPjEntrepot', 'cpPjStorage'],
            routes: [
              {
                path: '/basicManagement/warehouse/cp_warehouse',
                name: 'cp_warehouse',
                authority: ['CpEntrepot', 'CpStorage'],
                routes: [
                  {
                    path: '/basicManagement/warehouse/cp_warehouse/cp_entrepot_form',
                    name: 'cp_entrepot_form',
                    component: './ERP/CpEntrepotForm',
                    hideInMenu: true,
                    authority: ['CpEntrepot'],
                  },
                  {
                    path: '/basicManagement/warehouse/cp_warehouse/cp_entrepot_list',
                    name: 'cp_entrepot_list',
                    component: './ERP/CpEntrepotList',
                    authority: ['CpEntrepot'],
                  },
                  {
                    path: '/basicManagement/warehouse/cp_warehouse/cp_storage_form',
                    name: 'cp_storage_form',
                    component: './ERP/CpStorageForm',
                    hideInMenu: true,
                    authority: ['CpStorage']
                  },
                  {
                    path: '/basicManagement/warehouse/cp_warehouse/cp_storage_list',
                    name: 'cp_storage_list',
                    component: './ERP/CpStorageList',
                    authority: ['CpStorage'],
                  },
                ]
              },
              {
                path: '/basicManagement/warehouse/pj_warehouse',
                name: 'pj_warehouse',
                authority: ['cpPjEntrepot', 'cpPjStorage'],
                routes: [
                  {
                    path: '/basicManagement/warehouse/pj_warehouse/cp_pj_entrepot_form',
                    name: 'cp_pj_entrepot_form',
                    component: './ERP/CpPjEntrepotForm',
                    hideInMenu: true,
                    authority: ['cpPjEntrepot'],
                  },
                  {
                    path: '/basicManagement/warehouse/pj_warehouse/cp_pj_entrepot_list',
                    name: 'cp_pj_entrepot_list',
                    component: './ERP/CpPjEntrepotList',
                    authority: ['cpPjEntrepot'],
                  },
                  {
                    path: '/basicManagement/warehouse/pj_warehouse/cp_pj_storage_form',
                    name: 'cp_pj_storage_form',
                    component: './ERP/CpPjStorageForm',
                    hideInMenu: true,
                    authority: ['cpPjStorage'],
                  },
                  {
                    path: '/basicManagement/warehouse/pj_warehouse/cp_pj_storage_list',
                    name: 'cp_pj_storage_list',
                    component: './ERP/CpPjStorageList',
                    authority: ['cpPjStorage'],
                  },
                ]
              },

            ]
          },
          {
            path: '/basicManagement/supplier',
            name: 'supplier',
            icon: 'supplier',
            authority: ['cpSupplierAudit', 'cpSupplier'],
            routes: [
              {
                path: '/basicmanagement/supplier/cp_supplier_audit_form',
                name: 'cp_supplier_audit_form',
                component: './ERP/CpSupplierAuditForm',
                hideInMenu: true,
                authority: ['cpSupplierAudit'],
              },
              {
                path: '/basicmanagement/supplier/cp_supplier_audit_list',
                name: 'cp_supplier_audit_list',
                component: './ERP/CpSupplierAuditList',
                authority: ['cpSupplierAudit'],
              },
              {
                path: '/basicmanagement/supplier/cp_supplier_form',
                name: 'cp_supplier_form',
                component: './ERP/CpSupplierForm',
                hideInMenu: true,
                authority: ['cpSupplier'],
              },
              {
                path: '/basicmanagement/supplier/cp_supplier_list',
                name: 'cp_supplier_list',
                component: './ERP/CpSupplierList',
                authority: ['cpSupplier'],
              },
            ]
          },
        ]
      },

      {
        path: '/accessories',
        name: 'accessories',
        icon: 'accessories',
        authority: ['cpAfterApplicationFrom', 'cpAfterEntrustFrom', 'cpAfterSgFrom', 'cpAfterJaFrom', 'CBC'],
        routes: [
          {
            path: '/accessories/process/cp_batches_card_form',
            name: 'cp_batches_card_form',
            component: './ERP/cpBatchesCardForm',
            hideInMenu: true,
            authority: ['CBC'],
          },
          {
            path: '/accessories/process/cp_batches_card_list',
            name: 'cp_batches_card_list',
            component: './ERP/cpBatchesCardList',
            authority: ['CBC'],
          },
          {
            path: '/accessories/process/cp_after_application_from_form',
            name: 'cp_after_application_from_form',
            component: './ERP/cpAfterApplicationFromForm',
            hideInMenu: true,
            authority: ['cpAfterApplicationFrom'],
          },
          {
            path: '/accessories/process/cp_after_application_from_list',
            name: 'cp_after_application_from_list',
            component: './ERP/CpAfterApplicationFromList',
            authority: ['cpAfterApplicationFrom'],
          }
          ,
          {
            path: '/accessories/process/cp_after_history_from_form',
            name: 'cp_after_history_from_form',
            component: './ERP/cpAfterHistoryFromForm',
            hideInMenu: true,
            authority: ['History'],
          },
          {
            path: '/accessories/process/cp_after_history_from_list',
            name: 'cp_after_history_from_list',
            component: './ERP/cpAfterHistoryFromlist',
            authority: ['History'],
          },
          {
            path: '/accessories/process/cp_after_entrust_from_form',
            name: 'cp_after_entrust_from_form',
            component: './ERP/cpAfterEntrustFromForm',
            hideInMenu: true,
            authority: ['cpAfterEntrustFrom'],
          },
          {
            path: '/accessories/process/cp_after_entrust_from_list',
            name: 'cp_after_entrust_from_list',
            component: './ERP/cpAfterEntrustFromList',
            authority: ['cpAfterEntrustFrom'],
          },
          {
            path: '/accessories/process/cp_after_sg_from_form',
            name: 'cp_after_sg_from_form',
            component: './ERP/cpAfterSgFromForm',
            hideInMenu: true,
            authority: ['cpAfterSgFrom'],
          },
          {
            path: '/accessories/process/cp_after_sg_from_list',
            name: 'cp_after_sg_from_list',
            component: './ERP/cpAfterSgFromList',
            authority: ['cpAfterSgFrom'],
          },
          {
            path: '/accessories/process/cp_after_ja_from_form',
            name: 'cp_after_ja_from_form',
            component: './ERP/cpAfterJaFromForm',
            hideInMenu: true,
            authority: ['cpAfterJaFrom'],
          },
          {
            path: '/accessories/process/cp_after_ja_from_list',
            name: 'cp_after_ja_from_list',
            component: './ERP/cpAfterJaFromList',
            authority: ['cpAfterJaFrom'],
          },
        ]
      },


      {
        path: '/purchase',
        name: 'purchase',
        icon: 'purchase',
        authority: ['cpPurchaseFrom', 'cpZcPurchaseFrom'],
        routes: [
          {
            path: '/purchase/process/cp_purchase_from_form',
            name: 'cp_purchase_from_form',
            component: './ERP/cpPurchaseFromForm',
            hideInMenu: true,
            authority: ['cpPurchaseFrom'],
          },
          {
            path: '/purchase/process/cp_purchase_from_list',
            name: 'cp_purchase_from_list',
            component: './ERP/cpPurchaseFromList',
            authority: ['cpPurchaseFrom'],
          },
          {
            path: '/purchase/process/cp_zc_purchase_from_form',
            name: 'cp_zc_purchase_from_form',
            component: './ERP/cpZcPurchaseFromForm',
            hideInMenu: true,
            authority: ['cpZcPurchaseFrom'],
          },
          {
            path: '/purchase/process/cp_zc_purchase_from_list',
            name: 'cp_zc_purchase_from_list',
            component: './ERP/cpZcPurchaseFromList',
            authority: ['cpZcPurchaseFrom'],
          },
          {
            path: '/purchase/process/cp_subscribe_from_List',
            name: 'cp_subscribe_from_List',
            component: './ERP/CpSubscribeFromList',
            hideInMenu: false,
            authority: ['cpZcPurchaseFrom'],
          },
          {
            path: '/purchase/process/cp_sg_subscribe_from_form',
            name: 'cp_sg_subscribe_from_form',
            component: './ERP/cpSGSubscribeFromForm',
            hideInMenu: true,
            authority: ['cpZcPurchaseFrom'],
          },
        ]
      },

      {
        path: '/business',
        name: 'business',
        icon: 'business',
        authority: ['cpBusinessIntention', 'cpAssemblyForm', 'cpBusinessOrder', 'cpCarloadConstructionForm', 'cpCarloadConstructionForm2',
          'cpAtWorkForm', 'cpCarloadConstructionForm3', 'cpStayForm', 'cpAssemblyForm', 'cpPendingSingelForm',
          'cpSingelForm', 'cpOfferForm', 'cpSettlementForm', 'cpDischargedForm', 'cpAccessoriesSalesForm', 'cpInternalOrder'
          , 'cpAccessoriesWorkForm', 'cpMoneyChange', 'cqd', 'exit', 'already', 'Issue', 'cpStartInvoice', 'CQC'],
        routes: [
          //   path:'/process'

          // {
          //   path: '/business/process',
          //   name: 'business_process',
          //   // component: './Forms/StepForm',
          //   routes: [
          {
            path: '/business/process/cp_business_intention_form',
            name: 'cp_business_intention_form',
            component: './ERP/CpBusinessIntentionForm',
            hideInMenu: true,
            authority: ['cpBusinessIntention'],
          },
          {
            path: '/business/process/cp_business_intention_print',
            name: 'cp_business_intention_print',
            component: './ERP/publicprint',
            hideInMenu: true,
          },
          {
            path: '/business/process/cp_business_intention_list',
            name: 'cp_business_intention_list',
            component: './ERP/CpBusinessIntentionList',
            authority: ['cpBusinessIntention'],
          },
          {
            path: '/business/process/cp_assembly_form_form',
            name: 'cp_assembly_form_form',
            component: './ERP/CpAssemblyFormForm1',
            hideInMenu: true,
            authority: ['cpAssemblyForm'],
          },
          {
            path: '/business/process/cp_assembly_form_list',
            name: 'cp_assembly_form_list',
            component: './ERP/CpAssemblyFormList',
            authority: ['cpAssemblyForm'],

          },

          {
            path: '/business/process/cp_business_order_form',
            name: 'cp_business_order_form',
            component: './ERP/cpBusinessOrderForm',
            hideInMenu: true,
            authority: ['cpBusinessOrder'],
          },
          {
            path: '/business/process/cp_business_order_list',
            name: 'cp_business_order_list',
            component: './ERP/cpBusinessOrderList',
            authority: ['cpBusinessOrder'],
          },
          {
            path: '/business/process/cp_carload_construction_form_form',
            name: 'cp_carload_construction_form_form',
            component: './ERP/cpCarloadConstructionFormForm',
            hideInMenu: true,
            authority: ['cpCarloadConstructionForm'],
          },
          {
            path: '/business/process/cp_carload_construction_form_list',
            name: 'cp_carload_construction_form_list',
            component: './ERP/cpCarloadConstructionFormList',
            authority: ['cpCarloadConstructionForm'],
          },
          {
            path: '/business/process/ZC_road_work_list',
            name: 'ZC_road_work_list',
            component: './ERP/ZCRoadWorkList',
            authority: ['cpCarloadConstructionForm2'],
          },
          {
            path: '/business/process/cp_at_work_form_list',
            name: 'cp_at_work_form_list',
            component: './ERP/CpAtWorkFormList',
            authority: ['cpAtWorkForm'],
          },
          {
            path: '/business/process/cp_at_work_form_form',
            name: 'cp_at_work_form_form',
            component: './ERP/CpAtWorkFormForm',
            hideInMenu: true,
            authority: ['cpAtWorkForm'],
          },
          {
            path: '/business/process/AT_road_work_list',
            name: 'AT_road_work_list',
            component: './ERP/ATRoadWorkList',
            authority: ['cpCarloadConstructionForm3'],
          },
          {
            path: '/business/process/cp_stay_form_list',
            name: 'cp_stay_form_list',
            component: './ERP/cpStayFormList',
            authority: ['cpStayForm'],
          },
          {
            path: '/business/process/cp_stay_form_form',
            name: 'cp_stay_form_form',
            component: './ERP/cpStayFormForm',
            hideInMenu: true,
            authority: ['cpStayForm'],
          },
          {
            path: '/business/process/cp_stay_form_list_dateil',
            name: 'cp_stay_form_list_dateil',
            component: './ERP/cpStayFormListDateil',
            hideInMenu: false,
            authority: ['cpStayForm1'],
          },
          {
            path: '/business/process/cp_stay_form_form_dateil',
            name: 'cp_stay_form_form_dateil',
            component: './ERP/cpStayFormFormDateil',
            hideInMenu: true,
            authority: ['cpStayForm1'],
          },
          {
            path: '/business/process/cp_pending_singel_form_list',
            name: 'cp_pending_singel_form_list',
            component: './ERP/cpPendingSingelFormList',
            authority: ['cpPendingSingelForm'],
          },
          {
            path: '/business/process/cp_pending_singel_form_form',
            name: 'cp_pending_singel_form_form',
            component: './ERP/cpPendingSingelFormForm',
            hideInMenu: true,
            authority: ['cpPendingSingelForm'],
          },
          {
            path: '/business/process/cp_singel_form_list',
            name: 'cp_singel_form_list',
            component: './ERP/cpSingelFormList',
            authority: ['cpSingelForm'],
          },
          {
            path: '/business/process/cp_singel_form_form',
            name: 'cp_singel_form_form',
            component: './ERP/cpSingelFormForm1',
            hideInMenu: true,
            authority: ['cpSingelForm'],

          },
          {
            path: '/business/process/cp_offer_form_list',
            name: 'cp_offer_form_list',
            component: './ERP/CpOfferFormList',
            authority: ['cpOfferForm'],
          },
          {
            path: '/business/process/cp_offer_form_form',
            name: 'cp_offer_form_form',
            component: './ERP/CpOfferFormForm',
            hideInMenu: true,
            authority: ['cpOfferForm'],
          },
          {
            path: '/business/process/cp_settlement_form_list',
            name: 'cp_settlement_form_list',
            component: './ERP/cpSettlementFormList',
            authority: ['cpSettlementForm'],
          },
          {
            path: '/business/process/cp_settlement_form_form',
            name: 'cp_settlement_form_form',
            component: './ERP/cpSettlementFormForm',
            authority: ['cpSettlementForm'],
            hideInMenu: true
          },
          {
            path: '/business/process/release_order_list',
            name: 'release_order_list',
            component: './ERP/ReleaseOrderList',
            authority: ['cpDischargedForm'],
          },
          {
            path: '/business/process/release_order_form',
            name: 'release_order_form',
            component: './ERP/ReleaseOrderForm',
            authority: ['cpDischargedForm'],
            hideInMenu: true
          },
          {
            path: '/business/process/cp_accessories_sales_form_form',
            name: 'cp_accessories_sales_form_form',
            component: './ERP/cpAccessoriesSalesFormForm',
            authority: ['cpAccessoriesSalesForm'],
            hideInMenu: true,
          },
          {
            path: '/business/process/cp_accessories_sales_form_list',
            name: 'cp_accessories_sales_form_list',
            component: './ERP/cpAccessoriesSalesFormList',
            authority: ['cpAccessoriesSalesForm'],
          },
          {
            path: '/business/process/Cp_sale_pending_list',
            name: 'Cp_sale_pending_list',
            component: './ERP/CpSalePendingList',
            authority: ['SMF'],
          },
          {
            path: '/business/process/cp_internal_order_form',
            name: 'cp_internal_order_form',
            component: './ERP/cpInternalOrderForm',
            authority: ['cpInternalOrder'],
            hideInMenu: true,
          },
          {
            path: '/business/process/cp_internal_order_list',
            name: 'cp_internal_order_list',
            component: './ERP/CpInternalOrderList',
            authority: ['cpInternalOrder'],
          },
          {
            path: '/business/process/cp_accessories_work_form_form',
            name: 'cp_accessories_work_form_form',
            component: './ERP/cpAccessoriesWorkFormForm',
            hideInMenu: true,
            authority: ['cpAccessoriesWorkForm'],
          },
          {
            path: '/business/process/cp_accessories_work_form_list',
            name: 'cp_accessories_work_form_list',
            component: './ERP/cpAccessoriesWorkFormList',
            authority: ['cpAccessoriesWorkForm'],
          },

          {
            path: '/business/process/cp_money_change_form',
            name: 'cp_money_change_form',
            component: './ERP/cpMoneyChangeForm',
            hideInMenu: true,
            authority: ['cpMoneyChange'],
          },
          {
            path: '/business/process/cp_money_change_list',
            name: 'cp_money_change_list',
            component: './ERP/cpMoneyChangeList',
            authority: ['cpMoneyChange'],
          },
          {
            path: '/business/process/cp_start_invoice_form',
            name: 'cp_start_invoice_form',
            component: './ERP/cpStartInvoiceForm',
            hideInMenu: true,
            authority: ['cpStartInvoice'],
          },
          {
            path: '/business/process/cp_start_invoice_list',
            name: 'cp_start_invoice_list',
            component: './ERP/cpStartInvoiceList',
            authority: ['cpStartInvoice'],
          },
          {
            path: '/business/process/cp_start_invoice_wait_list',
            name: 'cp_start_invoice_wait_list',
            component: './ERP/CpStartInvoiceWaitList',
            authority: ['Issue'],
          },
          {
            path: '/business/process/cp_start_invoice_already_list',
            name: 'cp_start_invoice_already_list',
            component: './ERP/CpStartInvoiceAlreadyList',
            authority: ['already'],
          },
          {
            path: '/business/process/cp_startInvoice_already_form',
            name: 'cp_startInvoice_already_form',
            component: './ERP/cpStartInvoiceAlreadyForm',
            hideInMenu: true,
            authority: ['already'],
          },
          {
            path: '/business/process/cp_start_invoice_refund_list',
            name: 'cp_start_invoice_refund_list',
            component: './ERP/CpStartInvoiceRefundList',
            authority: ['exit'],
          },
          {
            path: '/business/process/cp_quality_card_form',
            name: 'cp_quality_card_form',
            component: './ERP/cpQualityCardForm',
            hideInMenu: true,
            authority: ['cqd'],
          },
          {
            path: '/business/process/cp_quality_card_list',
            name: 'cp_quality_card_list',
            component: './ERP/cpQualityCardList',
            authority: ['cqd'],
          },
          {
            path: '/business/process/cp_quality_change_list',
            name: 'Cp_quality_change_list',
            component: './ERP/CpQualityChangeList',
            authority: ['CQC'],
          },
          {
            path: '/business/process/cp_quality_change_form',
            name: 'Cp_quality_change_form',
            component: './ERP/CpQualityChangeForm',
            hideInMenu: true,
            authority: ['CQC'],
          },
          // {
          //   path: '/business/process/cp_accessoriesSales_price_list',
          //   name: 'cp_accessoriesSales_price_list',
          //   component: './ERP/cpAccessoriesSalesPriceList',
          //   authority: ['aPrice'],
          // }
        ]
      },

      {
        path: '/warehouse',
        name: 'warehouse',
        icon: 'warehouse',
        authority: ['cpAccessoriesAllot', 'cpPurchaseStockPending', 'cpInStorageFrom',
          'cpOutSalesFrom', 'cpOutbound', 'cpOutStorageFrom', 'cpQuitFrom', 'cpProduct', 'cpProductSalesFrom', 'cpOutProduct',
          'cpProductQuitFrom', 'cpCostForm', 'cpClose', 'pjRepertory', 'zcRepertory', 'CJRepertory', 'zcCJRepertory' ,'aPrice'], // mQuery
        routes: [
          // {
          //   path: '/warehouse/process/cp_billMaterial_search_list',
          //   name: 'cp_billMaterial_search_list',
          //   component: './ERP/CpBillMaterialSearchList',
          //   hideInMenu: true,

          // },
          {
            path: '/warehouse/process/cp_purchase_stock_pending_form',
            name: 'cp_purchase_stock_pending_form',
            component: './ERP/cpPurchaseStockPendingForm',
            hideInMenu: true,
            authority: ['cpPurchaseStockPending'],
          },
          {
            path: '/warehouse/process/cp_purchase_stock_pending_list',
            name: 'cp_purchase_stock_pending_list',
            component: './ERP/cpPurchaseStockPendingList',
            authority: ['cpPurchaseStockPending'],
          },
          {
            path: '/warehouse/process/cp_in_storage_from_form',
            name: 'cp_in_storage_from_form',
            component: './ERP/cpInStorageFromForm',
            hideInMenu: true,
            authority: ['cpInStorageFrom'],
          },
          {
            path: '/warehouse/process/cp_in_storage_from_list',
            name: 'cp_in_storage_from_list',
            component: './ERP/cpInStorageFromList',
            authority: ['cpInStorageFrom'],
          },
          {
            path: '/warehouse/process/cp_out_sales_from_form',
            name: 'cp_out_sales_from_form',
            component: './ERP/cpOutSalesFromForm',
            hideInMenu: true,
            authority: ['cpOutSalesFrom'],
          },
          {
            path: '/warehouse/process/cp_out_sales_from_list',
            name: 'cp_out_sales_from_list',
            component: './ERP/cpOutSalesFromList',
            authority: ['cpOutSalesFrom'],
          },
          {
            path: '/warehouse/process/cp_outbound_form',
            name: 'cp_outbound_form',
            component: './ERP/cpOutboundForm',
            hideInMenu: true,
            authority: ['cpOutbound'],
          },

          {
            path: '/warehouse/process/cp_outbound_list',
            name: 'cp_outbound_list',
            component: './ERP/cpOutboundList',
            authority: ['cpOutbound'],
          },
          {
            path: '/warehouse/process/cp_out_storage_from_form',
            name: 'cp_out_storage_from_form',
            component: './ERP/cpOutStorageFromForm',
            hideInMenu: true,
            authority: ['cpOutStorageFrom'],
          },
          {
            path: '/warehouse/process/cp_out_storage_from_list',
            name: 'cp_out_storage_from_list',
            component: './ERP/cpOutStorageFromList',
            authority: ['cpOutStorageFrom'],
          },
          {
            path: '/warehouse/process/cp_quit_from_form',
            name: 'cp_quit_from_form',
            component: './ERP/cpQuitFromForm',
            hideInMenu: true,
            authority: ['cpQuitFrom'],
          },
          {
            path: '/warehouse/process/cp_quit_from_list',
            name: 'cp_quit_from_list',
            component: './ERP/cpQuitFromList',
            authority: ['cpQuitFrom'],
          },
          {
            path: '/warehouse/process/cp_product_form',
            name: 'cp_product_form',
            component: './ERP/cpProductForm',
            hideInMenu: true,
            authority: ['cpProduct'],
          },
          {
            path: '/warehouse/process/cp_product_list',
            name: 'cp_product_list',
            component: './ERP/cpProductList',
            authority: ['cpProduct'],
          },
          {
            path: '/warehouse/process/cp_product_sales_from_form',
            name: 'cp_product_sales_from_form',
            component: './ERP/cpProductSalesFromForm',
            hideInMenu: true,
            authority: ['cpProductSalesFrom'],
          },
          {
            path: '/warehouse/process/cp_product_sales_from_list',
            name: 'cp_product_sales_from_list',
            component: './ERP/cpProductSalesFromList',
            authority: ['cpProductSalesFrom'],
          },
          {
            path: '/warehouse/process/cp_out_product_form',
            name: 'cp_out_product_form',
            component: './ERP/cpOutProductForm',
            hideInMenu: true,
            authority: ['cpOutProduct'],
          },
          {
            path: '/warehouse/process/cp_out_product_list',
            name: 'cp_out_product_list',
            component: './ERP/cpOutProductList',
            authority: ['cpOutProduct'],
          },
          {
            path: '/warehouse/process/cp_product_quit_from_form',
            name: 'cp_product_quit_from_form',
            component: './ERP/cpProductQuitFromForm',
            hideInMenu: true,
            authority: ['cpProductQuitFrom'],
          },
          {
            path: '/warehouse/process/cp_product_quit_from_list',
            name: 'cp_product_quit_from_list',
            component: './ERP/cpProductQuitFromList',
            authority: ['cpProductQuitFrom'],
          },
          {
            path: '/warehouse/process/cp_cost_form_form',
            name: 'cp_cost_form_form',
            component: './ERP/cpCostFormForm',
            hideInMenu: true,
            authority: ['cpCostForm'],
          },
          {
            path: '/warehouse/process/cp_cost_form_list',
            name: 'cp_cost_form_list',
            component: './ERP/cpCostFormList',
            authority: ['cpCostForm'],
          },


          {
            path: '/warehouse/process/Cp_Close_Form',
            name: 'Cp_Close_Form',
            component: './ERP/CpCloseForm',
            hideInMenu: true,
            authority: ['cpClose'],
          },
          {
            path: '/warehouse/process/Cp_Close_list',
            name: 'Cp_Close_list',
            component: './ERP/CpCloseList',
            authority: ['cpClose'],
          },
          {
            path: '/warehouse/process/cp_accessories_allot_form',
            name: 'cp_accessories_allot_form',
            component: './ERP/cpAccessoriesAllotForm',
            hideInMenu: true,
            authority: ['cpAccessoriesAllot'],
          },
          {
            path: '/warehouse/process/cp_accessories_allot_list',
            name: 'cp_accessories_allot_list',
            component: './ERP/CpAccessoriesAllotList',
            authority: ['cpAccessoriesAllot'],
          },
          // {
          //   path: '/warehouse/process/Cp_sale_pending_list',
          //   name: 'Cp_sale_pending_list',
          //   component: './ERP/CpSalePendingList',
          //   authority: ['SMF'],
          // },
          {
            path: '/warehouse/process/cp_pjInventory_from_form',
            name: 'cp_pjInventory_from_form',
            component: './ERP/cpPjInventoryFromForm',
            hideInMenu: true,
            authority: ['PD'],
          },
          {
            path: '/warehouse/process/cp_pjInventory_from_list',
            name: 'cp_pjInventory_from_list',
            component: './ERP/cpPjInventoryFromList',
            authority: ['PD'],
          },
          //  总成盘点单信息 start
          {
            path: '/warehouse/process/cp_assembly_inventory_form',
            name: 'cp_assembly_inventory_form',
            component: './ERP/cpZcInventoryFromForm',
            hideInMenu: true,
            authority: ['PDZC'],
          },
          {
            path: '/warehouse/process/cp_assembly_inventory_list',
            name: 'cp_assembly_inventory_list',
            component: './ERP/cpZcInventoryFromList',
            authority: ['PDZC'],
          },
          {
            path: '/warehouse/process/cp_material_code',
            name: 'cp_material_code',
            component: './ERP/CpMaterialCode',
            // authority: ['mQuery'],
          },
          {
            path: '/warehouse/process/cp_accessoriesSales_price_list',
            name: 'cp_accessoriesSales_price_list',
            component: './ERP/cpAccessoriesSalesPriceList',
            authority: ['aPrice'],
          },
          {
            path: '/warehouse/process/cp_accessoriesSales_price_form',
            name: 'cp_accessoriesSales_price_form',
            component: './ERP/cpAccessoriesSalesPriceForm',
            hideInMenu: true,
            authority: ['aPrice'],
          },
          //  总成盘点单信息 end
          {
            path: '/warehouse/report',
            name: 'report',
            authority: ['pjRepertory', 'zcRepertory', 'CJRepertory', 'zcCJRepertory'],
            // component: './ERP/CompanyForm',
            routes: [
              {
                path: '/warehouse/report/pjrepertory',
                name: 'pjrepertory',
                component: './ERP/pjRepertory',
                authority: ['pjRepertory'],
              },
              {
                path: '/warehouse/report/zcrepertory',
                name: 'zcrepertory',
                component: './ERP/zcRepertory',
                authority: ['zcRepertory'],
              },
              // {
              //   path: '/warehouse/report/cjRepertory',
              //   name: 'cjrepertory',
              //   component: './ERP/cjRepertory',
              //   // authority: ['zcRepertory'],
              // },
              // {
              //   path: '/warehouse/report/zongcRepertory',
              //   name: 'zongcRepertory',
              //   component: './ERP/zongcRepertory',
              //   // authority: ['zcRepertory'],
              // },
              {
                path: '/warehouse/report/cjSiteRepertory',
                name: 'cjSiteRepertory',
                component: './ERP/CjSiteRepertory',
                authority: ['CJRepertory'],
              },
              {
                path: '/warehouse/report/CjZcSiteRepertory',
                name: 'CjZcSiteRepertory',
                component: './ERP/CjZcSiteRepertory',
                authority: ['zcCJRepertory'],
              },
            ]
          }
        ]
      },
      {
        path: '/review',
        name: 'review',
        icon: 'review',
        authority: ['cpMoneyChangeAudit'],
        routes: [
          {
            path: '/review/process/cp_money_change_audit_form',
            name: 'cp_money_change_audit_form',
            component: './ERP/cpMoneyChangeAuditForm',
            hideInMenu: true,
            authority: ['cpMoneyChangeAudit'],
          },
          {
            path: '/review/process/cp_money_change_audit_list',
            name: 'cp_money_change_audit_list',
            component: './ERP/cpMoneyChangeAuditList',
            authority: ['cpMoneyChangeAudit'],
          },
        ]
      },


      // {
      //   path: '/finance',
      //   name: 'finance',
      //   icon: 'finance',
      //   routes: [

      //   ]
      // },
      {
        path: '/informationInquiry',
        name: 'informationInquiry',
        icon: 'InformationInquiry',
        component: './ERP/InformationInquiry',
        authority: ['datum'],
      },
      {
        path: '/bom_query',
        name: 'bom_query',
        icon: 'BomQuery',
        hideInMenu: true,
        component: './ERP/BomQuery',
        authority: ['datum'],
      },

      {
        path: '/cp_new_bill_material_list',
        name: 'cp_bill_material_list_new',
        icon: 'cp_bill_material_list_new',
        hideInMenu: true,
        component: './ERP/CpBillMaterialListNew',
        authority: ['datum'],
      },

      {
        path: '/must_bom_inquiry',
        name: 'must_bom_inquiry',
        icon: 'must_bom_inquiry',
        component: './ERP/MustBomInquiry',
        authority: ['mutest'],
      },
      {
        path: '/must_bom_query',
        name: 'must_bom_query',
        icon: 'must_bom_query',
        hideInMenu: true,
        component: './ERP/MustBomQuery',
        authority: ['mutest'],
      },

      {
        path: '/cp_must_bill_material_list',
        name: 'cp_must_bill_material_list',
        icon: 'cp_must_bill_material_list',
        hideInMenu: true,
        component: './ERP/CpMustBillMaterialList',
        authority: ['mutest'],
      },

      {
        path: '/dataManagement',
        name: 'dataManagement',
        icon: 'dataManagement',
        authority: ['totalValue', 'wValue', 'nValue', 'pjjx', 'zcjx', 'pjjxt', 'zcjxt', 'cb', 'cbt', 'ml', 'pjrk', 'pjck', 'pjth', 'pjtl', 'zcrk', 'zctl', 'zcck'
          , 'zcth', 'cpjmx', 'cpjpmx', 'cpjpmxg', 'czcmx', 'czcpmx', 'czcpmxg', 'mcpmx', 'mgcpmx', 'pjsmx', 'ywyzb', 'shjacb', 'zcwx', 'khtj', 'pjcrk'
        ],
        routes: [
          // {
          //   path: '/dataManagement/process/all_output_statistics',
          //   name: 'all_output_statistics',
          //   component: './ERP/AllValueStatistics',
          //   // hideInMenu: true,
          //   authority: ['totalStatement'],
          // },
          {
            path: '/dataManagement/process/all_output_value',
            name: 'all_output_value',
            component: './ERP/AllOutputValue',
            // hideInMenu: true,
            authority: ['totalValue'],
          },
          {
            path: '/dataManagement/process/externall_output_value',
            name: 'externall_output_value',
            component: './ERP/ExternallOutputValue',
            // hideInMenu: true,
            authority: ['wValue'],
          },
          {
            path: '/dataManagement/process/internal_output_value',
            name: 'internal_output_value',
            component: './ERP/InternalOutputValue',
            // hideInMenu: true,
            authority: ['nValue'],
          },
          {
            path: '/dataManagement/process/pj_invoicing',
            name: 'pj_invoicing',
            component: './ERP/PjInvoicing',
            // hideInMenu: true,
            authority: ['pjjx'],
          },
          {
            path: '/dataManagement/process/zc_invoicing',
            name: 'zc_invoicing',
            component: './ERP/ZcInvoicing',
            // hideInMenu: true,
            authority: ['zcjx'],
          },
          {
            path: '/dataManagement/process/pj_two_invoicing',
            name: 'pj_two_invoicing',
            component: './ERP/PjTwoInvoicing',
            // hideInMenu: true,
            authority: ['pjjxt'],
          },
          {
            path: '/dataManagement/process/zc_two_invoicing',
            name: 'zc_two_invoicing',
            component: './ERP/ZcTwoInvoicing',
            // hideInMenu: true,
            authority: ['zcjxt'],
          },
          {
            path: '/dataManagement/process/cost_repertory',
            name: 'cost_repertory',
            component: './ERP/CostRepertory',
            authority: ['cb'],
          },
          {
            path: '/dataManagement/process/cost_two_repertory',
            name: 'cost_two_repertory',
            component: './ERP/CostTwoRepertory',
            authority: ['cbt'],
          },
          {
            path: '/dataManagement/process/gross_profit',
            name: 'gross_profit',
            component: './ERP/GrossProfit',
            authority: ['ml'],
          },
          {
            path: '/dataManagement/process/inStorage_repertory',
            name: 'inStorage_repertory',
            component: './ERP/InStorageRepertory',
            authority: ['pjrk'],
          },
          {
            path: '/dataManagement/process/outSalesFrom_repertory',
            name: 'outSalesFrom_repertory',
            component: './ERP/OutSalesFromRepertory',
            authority: ['pjth'],
          },
          {
            path: '/dataManagement/process/outStorage_repertory',
            name: 'outStorage_repertory',
            component: './ERP/OutStorageRepertory',
            authority: ['pjck'],
          },
          {
            path: '/dataManagement/process/quitFrom_repertory',
            name: 'quitFrom_repertory',
            component: './ERP/QuitFromRepertory',
            authority: ['pjtl'],
          },
          {
            path: '/dataManagement/process/zc_inStorage_repertory',
            name: 'zc_inStorage_repertory',
            component: './ERP/ZcInStorageRepertory',
            authority: ['zcrk'],
          },
          {
            path: '/dataManagement/process/zc_outSalesFrom_repertory',
            name: 'zc_outSalesFrom_repertory',
            component: './ERP/ZcOutSalesFromRepertory',
            authority: ['zcth'],
          },
          {
            path: '/dataManagement/process/zc_outStorage_repertory',
            name: 'zc_outStorage_repertory',
            component: './ERP/ZcOutStorageRepertory',
            authority: ['zcck'],
          },
          {
            path: '/dataManagement/process/zc_quitFrom_repertory',
            name: 'zc_quitFrom_repertory',
            component: './ERP/ZcQuitFromRepertory',
            authority: ['zctl'],
          },
          {
            path: '/dataManagement/process/quitFrom_purchase',
            name: 'quitFrom_purchase',
            component: './ERP/QuitFromPurchase',
            authority: ['cpjmx'],
          },
          {
            path: '/dataManagement/process/fgs_analyzeFrom_purchase',
            name: 'fgs_analyzeFrom_purchase',
            component: './ERP/FgsAnalyzeFromPurchase',
            authority: ['cpjpmx'],
          },
          {
            path: '/dataManagement/process/supplier_analyzeFrom_purchase',
            name: 'supplier_analyzeFrom_purchase',
            component: './ERP/SupplierAnalyzeFromPurchase',
            authority: ['cpjpmxg'],
          },
          {
            path: '/dataManagement/process/supplier_assemblyFrom_purchase',
            name: 'supplier_assemblyFrom_purchase',
            component: './ERP/SupplierAssemblyFromPurchase',
            authority: ['czcmx'],
          },
          {
            path: '/dataManagement/process/filiale_assemblyFrom_purchase',
            name: 'filiale_assemblyFrom_purchase',
            component: './ERP/FilialeAssemblyFromPurchase',
            authority: ['czcpmx'],
          },
          {
            path: '/dataManagement/process/zc_assemblyFrom_purchase',
            name: 'zc_assemblyFrom_purchase',
            component: './ERP/ZcAssemblyFromPurchase',
            authority: ['czcpmxg'],
          },
          {
            path: '/dataManagement/process/monthly_detailFrom_purchase',
            name: 'monthly_detailFrom_purchase',
            component: './ERP/MonthlyDetailFromPurchase',
            authority: ['mcpmx'],
          },
          {
            path: '/dataManagement/process/monthly_confluenceFrom_purchase',
            name: 'monthly_confluenceFrom_purchase',
            component: './ERP/MonthlyConfluenceFromPurchase',
            authority: ['mgcpmx'],
          },
          {
            path: '/dataManagement/process/accessories_profitFrom_sell',
            name: 'accessories_profitFrom_sell',
            component: './ERP/AccessoriesProfitFromSell',
            authority: ['pjsmx'],
          },
          {
            path: '/dataManagement/process/company_salesman_makeUpFrom',
            name: 'company_salesman_makeUpFrom',
            component: './ERP/CompanySalesmanMakeUpFrom',
            authority: ['ywyzb'],
          },
          {
            path: '/dataManagement/process/afterSale_orderClosing_costFrom',
            name: 'afterSale_orderClosing_costFrom',
            component: './ERP/AfterSaleOrderClosingCostFrom',
            authority: ['shjacb'],
          },
          {
            path: '/dataManagement/process/zc_maintain_sellFrom',
            name: 'zc_maintain_sellFrom',
            component: './ERP/ZcMaintainSellFrom',
            authority: ['zcwx'],
          },
          {
            path: '/dataManagement/process/client_statistic_analysisFrom',
            name: 'client_statistic_analysisFrom',
            component: './ERP/ClientStatisticAnalysisFrom',
            authority: ['khtj'],
          },
          {
            path: '/dataManagement/process/Access_or_iesInAndOutAnalyze',
            name: 'Access_or_iesInAndOutAnalyze',
            component: './ERP/AccessoriesInAndOutAnalyze',
            authority: ['pjcrk'],
          },
        ]
      },

      // {
      //   path: '/statistics',
      //   name: 'statistics',
      //   icon: 'statistics',
      //   routes: [
      //     {
      //       path: '/statistics/process/monthly_statistics',
      //       name: 'monthly_statistics',
      //       component: './ERP/MonthlyStatistics',
      //     }
      //   ]
      // },


      // {
      //   path: '/basicManagement/materials/cp_bill_material_new',
      //   name: 'cp_bill_material_new',
      //   component: './ERP/cpBillMaterialNew',
      //   authority: ['cpBillMaterial'],
      //   hideInMenu: true
      // },

      // {
      //   path: '/quickQuery',
      //   name: 'quickQuery',
      //   component: './ERP/cpMoneyChangeAuditList',
      // },

      // end

      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        hideInMenu: true,
        routes: [
          {
            path: '/dashboard/analysis',
            name: 'analysis',
            component: './Dashboard/Analysis',
          },
          {
            path: '/dashboard/monitor',
            name: 'monitor',
            component: './Dashboard/Monitor',
          },
          {
            path: '/dashboard/workplace',
            name: 'workplace',
            component: './Dashboard/Workplace',
          },
        ],
      },
      // forms
      {
        path: '/form',
        icon: 'form',
        name: 'form',
        hideInMenu: true,
        routes: [
          {
            path: '/form/basic-form',
            name: 'basicform',
            component: './Forms/BasicForm',
          },
          {
            path: '/form/step-form',
            name: 'stepform',
            component: './Forms/StepForm',
          },
          {
            path: '/form/advanced-form',
            name: 'advancedform',
            authority: ['admin'],
            component: './Forms/AdvancedForm',
          },
        ],
      },
      // list
      {
        path: '/list',
        icon: 'table',
        name: 'list',
        hideInMenu: true,
        routes: [
          {
            path: '/list/table-list',
            name: 'searchtable',
            component: './List/TableList',
          },
          {
            path: '/list/basic-list',
            name: 'basiclist',
            component: './List/BasicList',
          },
          {
            path: '/list/basic_edit_list',
            name: 'basic_edit_list',
            component: './List/BasicEdit/BasicEditList',
          },
          {
            path: '/list/basic_edit_form',
            name: 'basic_edit_form',
            component: './List/BasicEdit/BasicEditForm',
            hideInMenu: true,
          },



          {
            path: '/list/card-list',
            name: 'cardlist',
            component: './List/CardList',
          },
          {
            path: '/list/search',
            name: 'searchlist',
            component: './List/List',
            routes: [
              {
                path: '/list/search',
                redirect: '/list/search/articles',
              },
              {
                path: '/list/search/articles',
                name: 'articles',
                component: './List/Articles',
              },
              {
                path: '/list/search/projects',
                name: 'projects',
                component: './List/Projects',
              },
              {
                path: '/list/search/applications',
                name: 'applications',
                component: './List/Applications',
              },
            ],
          },
        ],
      },
      {
        path: '/profile',
        name: 'profile',
        icon: 'profile',
        hideInMenu: true,
        routes: [
          // profile
          {
            path: '/profile/basic',
            name: 'basic',
            component: './Profile/BasicProfile',
          },
          {
            path: '/profile/basic/:id',
            hideInMenu: true,
            component: './Profile/BasicProfile',
          },
          {
            path: '/profile/advanced',
            name: 'advanced',
            authority: ['admin'],
            component: './Profile/AdvancedProfile',
          },
        ],
      },
      {
        name: 'result',
        icon: 'check-circle-o',
        path: '/result',
        hideInMenu: true,
        routes: [
          // result
          {
            path: '/result/success',
            name: 'success',
            component: './Result/Success',
          },
          { path: '/result/fail', name: 'fail', component: './Result/Error' },
        ],
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        hideInMenu: true,
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/401',
            name: 'without_permission',
            component: './Exception/401',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        name: 'account',
        icon: 'user',
        path: '/account',
        hideInMenu: true,
        routes: [
          {
            path: '/account/center',
            name: 'center',
            component: './Account/Center/Center',
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: './Account/Settings/Info',
            hideInMenu: true,
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
              },
              {
                path: '/account/settings/security',
                component: './Account/Settings/SecurityView',
              },
              {
                path: '/account/settings/binding',
                component: './Account/Settings/BindingView',
              },
              {
                path: '/account/settings/notification',
                component: './Account/Settings/NotificationView',
              },
            ],
          },
        ],
      },
      //  editor
      {
        name: 'editor',
        icon: 'highlight',
        path: '/editor',
        hideInMenu: true,
        routes: [
          {
            path: '/editor/flow',
            name: 'flow',
            component: './Editor/GGEditor/Flow',
          },
          {
            path: '/editor/mind',
            name: 'mind',
            component: './Editor/GGEditor/Mind',
          },
          {
            path: '/editor/koni',
            name: 'koni',
            component: './Editor/GGEditor/Koni',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];


