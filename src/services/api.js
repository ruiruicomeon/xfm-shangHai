import { stringify } from 'qs';
import request from '@/utils/request';
// import { login } from './mock/user';
import { usePromise } from './mock/config';
import getFakeChartData from './mock/chart';
import { async } from 'q';

export async function login(params) {
  // Agriculture/
  return request('/api/Beauty/login', {
    method: 'POST',
    body: params,
  });
}

//退出登录  (无权限)

export async function logout(params) {
  // Agriculture/
  return request('/api/Beauty/logout', {
    method: 'POST',
    body: params,
  });
}

// export async function logout() {
//   return request('/api/Beauty/logout');
// }

export async function getToken(params) {
  return request('/api/Beauty/sys/user/info', {
    method: 'POST',
    body: params,
  });
}

// start
// 上传图片
export async function uploadimg(params) {
  return request('/api/Beauty/sys/user/UploadFolder', {
    method: 'POST',
    body: params,
  });
}

// 查看人员菜单     （sys:area:view）
export async function queryMemSysArea(params) {
  return request('/api/Beauty/sys/role/form', {
    method: 'POST',
    body: params,
  });
}
// // 添加区域信息     （sys:area:edit）
// export async function addMemSysArea(params) {
//   return request('/api/Beauty/test/testOffice/updateTestOffice', {
//     method: 'POST',
//     body: params,
//   });
// }
// 删除区域信息  （sys:area:edit）
// export async function removeMemSysArea(params) {
//   return request('/api/Beauty/test/testOffice/updateTestOffice', {
//     method: 'POST',
//     body: params,
//   });
// }
// 获取用户列表  （sys:user:view）
export async function queryMemSysUser(params) {
  return request('/api/Beauty/sys/user/listData', {
    method: 'POST',
    body: params,
  });
}
//  新增修改用户   (sys:user:edit)
export async function addMemSysUser(params) {
  // return request(`/api/Mem/sys/user/save?${stringify(params)}`);
  return request('/api/Beauty/sys/user/save', {
    method: 'POST',
    body: params,
  });
}
//  删除用户   (sys:user:edit)
export async function delSysUser(params) {
  // return request(`/api/Mem/sys/user/save?${stringify(params)}`);
  return request('/api/Beauty/sys/user/delete', {
    method: 'POST',
    body: params,
  });
}

// 获取角色列表  (sys:role:view)
export async function queryMemSysRole(params) {
  return request('/api/Beauty/sys/role/listData', {
    method: 'POST',
    body: params,
  });
}
// 新增修改角色
export async function addMemSysRole(params) {
  return request('/api/Beauty/sys/role/save', {
    method: 'POST',
    body: params,
  });
}

// 删除角色
export async function deleteSysRole(params) {
  return request('/api/Beauty/sys/role/delete', {
    method: 'POST',
    body: params,
  });
}

// 查询所有层级
export async function queryOffice(params) {
  return request('/api/Beauty/sys/area/areaList', {
    method: 'POST',
    body: params,
  });
}
// 新增层级
export async function addOffice(params) {
  return request('/api/Beauty/sys/area/save', {
    method: 'POST',
    body: params,
  });
}

// 删除层级
export async function deleteOffice(params) {
  return request('/api/Beauty/sys/area/delete', {
    method: 'POST',
    body: params,
  });
}
// 树状图查询
export async function queryOfficelist(params) {
  return request('/api/Beauty/sys/area/listData', {
    method: 'POST',
    body: params,
  });
}

// 新增部门
export async function adddept(params) {
  return request('/api/Beauty/sys/dept/save', {
    method: 'POST',
    body: params,
  });
}

// 删除层级
export async function deletedept(params) {
  return request('/api/Beauty/sys/dept/delete', {
    method: 'POST',
    body: params,
  });
}
// 树状图查询
export async function querydeptlist(params) {
  return request('/api/Beauty/sys/dept/listData', {
    method: 'POST',
    body: params,
  });
}

// 新增公司
export async function addcompany(params) {
  return request('/api/Beauty/sys/office/postCpCompany', {
    method: 'POST',
    body: params,
  });
}

// 删除公司
export async function delcompany(params) {
  return request('/api/Beauty/sys/office/delete', {
    method: 'POST',
    body: params,
  });
}
// 公司树状图查询
export async function querycompanylist(params) {
  return request('/api/Beauty/sys/office/listData', {
    // return request('/api/Beauty/beauty/cpCompany/getCpCompanyList', {
    method: 'POST',
    body: params,
  });
}
// 公司详情
export async function companydetail(params) {
  return request('/api/Beauty/sys/office/getOffice', {
    method: 'POST',
    body: params,
  });
}
// 获取用户详情
export async function getuserdetail(params) {
  return request('/api/Beauty/sys/user/infoData', {
    method: 'POST',
    body: params,
  });
}
// 新增修改菜单
export async function addEditmenu(params) {
  return request('/api/Beauty/sys/menu/save', {
    method: 'POST',
    body: params,
  });
}
// 删除菜单
export async function deletemenu(params) {
  return request('/api/Beauty/sys/menu/delete', {
    method: 'POST',
    body: params,
  });
}

// 公告列表
export async function deleteSysDoc(params) {
  return request('/api/Beauty/sys/sysDoc/deleteSysDoc', {
    method: 'POST',
    body: params,
  });
}

// 公告列表
export async function getSysDocList(params) {
  return request('/api/Beauty/sys/sysDoc/getSysDocList', {
    method: 'POST',
    body: params,
  });
}

// 新建公告
export async function postSysDoc(params) {
  return request('/api/Beauty/sys/sysDoc/postSysDoc', {
    method: 'POST',
    body: params,
  });
}
// 打开关闭
export async function updateSysDoc(params) {
  return request('/api/Beauty/sys/sysDoc/updateSysDoc', {
    method: 'POST',
    body: params,
  });
}

// 新增人员公司
export async function addusercompany(params) {
  return request('/api/Beauty/beauty/cpUserCompany/postCpUserCompany', {
    method: 'POST',
    body: params,
  });
}
// 查看人员公司分配
export async function queryusercompany(params) {
  return request('/api/Beauty/beauty/cpUserCompany/getCpUserCompanyList', {
    method: 'POST',
    body: params,
  });
}

// 查看人员权限公司分配
export async function getUserOfficeList(params) {
  return request('/api/Beauty/beauty/cpUserCompany/getUserOfficeList', {
    method: 'POST',
    body: params,
  });
}

// 删除菜单
export async function deleteusercompanyu(params) {
  return request('/api/Beauty/beauty/cpUserCompany/deleteCpUserCompany', {
    method: 'POST',
    body: params,
  });
}
// //
// export async function exportUserAll(params) {
//   return request('/api/Beauty/sys/user/export', {
//     method: 'POST',
//     body: params,
//   });
// }
// 查询所有字典
export async function dictlist(params) {
  return request('/api/Beauty/sys/dict/list', {
    method: 'POST',
    body: params,
  });
}
// 新增字典
export async function adddict(params) {
  return request('/api/Beauty/sys/dict/save', {
    method: 'POST',
    body: params,
  });
}

// 删除字典
export async function deldict(params) {
  return request('/api/Beauty/sys/dict/delete', {
    method: 'POST',
    body: params,
  });
}

// 业务委托单撤销

// export async function cpBusinessOrderupdate(params) {
//   return request('/api/Beauty/beauty/cpBusinessOrder/update', {
//     method: 'POST',
//     body: params,
//   });
// }

// 新建内部订单

export async function createCpBusinessOrder(params) {
  return request('/api/Beauty/beauty/cpBusinessOrder/createCpBusinessOrder', {
    method: 'POST',
    body: params,
  });
}

export async function assemblyRevocation(params) {
  return request('/api/Beauty/beauty/cpBusinessOrder/revocation', {
    method: 'POST',
    body: params,
  });
}

// 业务委托单撤销
export async function cpassemblyRevocation(params) {
  return request('/api/Beauty/beauty/cpAssemblyForm/revocation', {
    method: 'POST',
    body: params,
  });
}

// apo????

// 意向单撤销

export async function cpBusinessIntentionupdata(params) {
  return request('/api/Beauty/beauty/cpBusinessIntention/update', {
    method: 'POST',
    body: params,
  });
}

export async function undoBusinessIntention(params) {
  return request('/api/Beauty/beauty/cpBusinessIntention/revocation', {
    method: 'POST',
    body: params,
  });
}

export async function listCpBusinessIntention(params) {
  return request('/api/Beauty/beauty/cpBusinessIntention/getCpBusinessIntentionList', {
    method: 'POST',
    body: params,
  });
}

export async function addCpBusinessIntention(params) {
  return request('/api/Beauty/beauty/cpBusinessIntention/postCpBusinessIntention', {
    method: 'POST',
    body: params,
  });
}

export async function updateCpBusinessIntention(params) {
  return request('/api/Beauty/beauty/cpBusinessIntention/updateCpBusinessIntention', {
    method: 'POST',
    body: params,
  });
}

export async function listNotPageCpBusinessIntention(params) {
  return request('/api/Beauty/beauty/cpBusinessIntention/getCpBusinessIntentionListNoPage', {
    method: 'POST',
    body: params,
  });
}

export async function deleteCpBusinessIntention(params) {
  return request('/api/Beauty/beauty/cpBusinessIntention/deleteCpBusinessIntention', {
    method: 'POST',
    body: params,
  });
}

export async function getCpBusinessIntention(params) {
  return request('/api/Beauty/beauty/cpBusinessIntention/getCpBusinessIntention', {
    method: 'POST',
    body: params,
  });
}

export async function listCpBusinessIntentionTreeData(params) {
  return request('/api/Beauty/beauty/cpBusinessIntention/treeData', {
    method: 'POST',
    body: params,
  });
}
//总成登记单

export async function cpAssemblyFormupdate(params) {
  return request('/api/Beauty/beauty/cpAssemblyForm/update', {
    method: 'POST',
    body: params,
  });
}

export async function listCpAssemblyForm(params) {
  return request('/api/Beauty/beauty/cpAssemblyForm/getCpAssemblyFormList', {
    method: 'POST',
    body: params,
  });
}

export async function addCpAssemblyForm(params) {
  return request('/api/Beauty/beauty/cpAssemblyForm/postCpAssemblyForm', {
    method: 'POST',
    body: params,
  });
}

export async function updateCpAssemblyForm(params) {
  return request('/api/Beauty/beauty/cpAssemblyForm/updateCpAssemblyForm', {
    method: 'POST',
    body: params,
  });
}

export async function listNotPageCpAssemblyForm(params) {
  return request('/api/Beauty/beauty/cpAssemblyForm/getCpAssemblyFormListNoPage', {
    method: 'POST',
    body: params,
  });
}

export async function deleteCpAssemblyForm(params) {
  return request('/api/Beauty/beauty/cpAssemblyForm/deleteCpAssemblyForm', {
    method: 'POST',
    body: params,
  });
}

export async function getCpAssemblyForm(params) {
  return request('/api/Beauty/beauty/cpAssemblyForm/getCpAssemblyForm', {
    method: 'POST',
    body: params,
  });
}

export async function listCpAssemblyFormTreeData(params) {
  return request('/api/Beauty/beauty/cpAssemblyForm/treeData', {
    method: 'POST',
    body: params,
  });
}
// 添加查询列表
export async function getCpClientLine(params) {
  return request('/api/Beauty/beauty/cpClient/getCpClientLine', {
    method: 'POST',
    body: params,
  });
}

//历史客户
export async function getCpClientList(params) {
  return request(`/api/Beauty/beauty/cpClientHistory/getCpClientList`, {
    method: 'POST',
    body: params,
  });
}

// 客户
export async function listCpClient(params) {
  return request(`/api/Beauty/beauty/cpClient/getCpClientList`, {
    method: 'POST',
    body: params,
  });
}

export async function addCpClient(params) {
  return request('/api/Beauty/beauty/cpClient/postCpClient', {
    method: 'POST',
    body: params,
  });
}

export async function updateCpClient(params) {
  return request('/api/Beauty/beauty/cpClient/updateCpClient', {
    method: 'POST',
    body: params,
  });
}

export async function listNotPageCpClient(params) {
  return request('/api/Beauty/beauty/cpClient/getCpClientListNoPage', {
    method: 'POST',
    body: params,
  });
}

export async function deleteCpClient(params) {
  return request('/api/Beauty/beauty/cpClient/deleteCpClient', {
    method: 'POST',
    body: params,
  });
}

export async function getCpClient(params) {
  return request('/api/Beauty/beauty/cpClient/getCpClient', {
    method: 'POST',
    body: params,
  });
}

export async function listCpClientTreeData(params) {
  return request('/api/Beauty/beauty/cpClient/treeData', {
    method: 'POST',
    body: params,
  });
}

// 整车

export async function cpCarloadConstructionFormupdate(params) {
  return request(`/api/Beauty/beauty/cpCarloadConstructionForm/update`, {
    method: 'POST',
    body: params,
  });
}

export async function listCpCarloadConstructionForm(params) {
  return request(`/api/Beauty/beauty/cpCarloadConstructionForm/getCpCarloadConstructionFormList`, {
    method: 'POST',
    body: params,
  });
}

export async function addCpCarloadConstructionForm(params) {
  return request('/api/Beauty/beauty/cpCarloadConstructionForm/postCpCarloadConstructionForm', {
    method: 'POST',
    body: params,
  });
}

export async function updateCpCarloadConstructionForm(params) {
  return request('/api/Beauty/beauty/cpCarloadConstructionForm/updateCpCarloadConstructionForm', {
    method: 'POST',
    body: params,
  });
}

export async function listNotPageCpCarloadConstructionForm(params) {
  return request(
    '/api/Beauty/beauty/cpCarloadConstructionForm/getCpCarloadConstructionFormListNoPage',
    {
      method: 'POST',
      body: params,
    }
  );
}

export async function deleteCpCarloadConstructionForm(params) {
  return request('/api/Beauty/beauty/cpCarloadConstructionForm/deleteCpCarloadConstructionForm', {
    method: 'POST',
    body: params,
  });
}

export async function getCpCarloadConstructionForm(params) {
  return request('/api/Beauty/beauty/cpCarloadConstructionForm/getCpCarloadConstructionForm', {
    method: 'POST',
    body: params,
  });
}
// 撤销整车施工单
export async function revocationCpCarloadConstructionForm(params) {
  return request('/api/Beauty/beauty/cpCarloadConstructionForm/revocation', {
    method: 'POST',
    body: params,
  });
}

export async function listCpCarloadConstructionFormTreeData(params) {
  return request('/api/Beauty/beauty/cpCarloadConstructionForm/treeData', {
    method: 'POST',
    body: params,
  });
}

// 待完工清单列表  （整车待完工清单 ，总成待完工清单） 1是ZC 2是AT
export async function listWaitinCompletion(params) {
  return request('/api/Beauty/beauty/cpCarloadConstructionForm/getToFinished', {
    method: 'POST',
    body: params,
  });
}

// 清单点击完工  （整车待完工清单 ，总成待完工清单） 1是ZC 2是AT
export async function updateCompletion(params) {
  return request('/api/Beauty/beauty/cpCarloadConstructionForm/completion', {
    method: 'POST',
    body: params,
  });
}

// 待处理报件单 重新提交
export async function cpDischargedFormresubmit(params) {
  return request('/api/Beauty/beauty/cpDischargedForm/resubmit', {
    method: 'POST',
    body: params,
  });
}

// 放行单列表
export async function cpDischargedFormupdata(params) {
  return request(`/api/Beauty/beauty/cpDischargedForm/update`, {
    method: 'POST',
    body: params,
  });
}

export async function listReleaseOrder(params) {
  return request(`/api/Beauty/beauty/cpDischargedForm/getCpDischargedFormList`, {
    method: 'POST',
    body: params,
  });
}

// 审核
export async function cpDischargedFormispass(params) {
  return request('/api/Beauty/beauty/cpDischargedForm/isPass', {
    method: 'POST',
    body: params,
  });
}

export async function cpDischargedFormsave(params) {
  return request('/api/Beauty/beauty/cpDischargedForm/save', {
    method: 'POST',
    body: params,
  });
}

// 撤销
export async function cpDischargedFormRevocation(params) {
  return request('/api/Beauty/beauty/cpDischargedForm/revocation', {
    method: 'POST',
    body: params,
  });
}

// 新增修改放行单
export async function updateReleaseOrder(params) {
  return request('/api/Beauty/beauty/cpDischargedForm/postCpDischargedForm', {
    method: 'POST',
    body: params,
  });
}

// 删除放行单
export async function deleteReleaseOrder(params) {
  return request('/api/Beauty/beauty/cpDischargedForm/deleteCpDischargedForm', {
    method: 'POST',
    body: params,
  });
}

// 获取放行单详情
export async function getReleaseOrder(params) {
  return request('/api/Beauty/beauty/cpDischargedForm/getCpDischargedForm', {
    method: 'POST',
    body: params,
  });
}

// 获取放行单多参数查询字段
export async function getReleaseOrderLine(params) {
  return request('/api/Beauty/beauty/cpDischargedForm/getCpDischargedFormLine', {
    method: 'POST',
    body: params,
  });
}

//

//
// // 导出
// export async function exportUserAll(params) {
//   return request('/api/Beauty/sys/user/listData', {
//     method: 'POST',
//     body: params,
//   });
// }
// end

// 客户可筛选字段
export async function listSearchCpLient(params) {
  return request('/api/Beauty/beauty/cpClient/getCpClientLine', {
    method: 'POST',
    body: params,
  });
}
// 业务意向单可筛选字段
export async function listSearchCpBusinessIntentionLine(params) {
  return request('/api/Beauty/beauty/cpBusinessIntention/getCpBusinessIntentionLine', {
    method: 'POST',
    body: params,
  });
}
// 总成登记单可筛选字段
export async function listSearchCpAssemblyLine(params) {
  return request('/api/Beauty/beauty/cpAssemblyForm/getCpAssemblyFormLine', {
    method: 'POST',
    body: params,
  });
}
// 业务委托单可筛选字段
export async function listSearchCpBusinessOrderLine(params) {
  return request('/api/Beauty/beauty/cpBusinessOrder/getCpBusinessOrderLine', {
    method: 'POST',
    body: params,
  });
}
// 整车施工单可筛选字段
export async function listSearchCpCarloadConstructionLine(params) {
  return request('/api/Beauty/beauty/cpCarloadConstructionForm/getCpCarloadConstructionFormLine', {
    method: 'POST',
    body: params,
  });
}

// 总成施工单可筛选字段
export async function listSearchCpAtWorkFormLine(params) {
  return request('/api/Beauty/beauty/cpAtWorkForm/getCpAtWorkFormLine', {
    method: 'POST',
    body: params,
  });
}

// 报价单可筛选字段

export async function listSearchCpOfferLine(params) {
  return request('/api/Beauty/beauty/cpOfferDetail/getCpOfferDetailLine', {
    method: 'POST',
    body: params,
  });
}

// // 整车施工单可筛选字段
// export async function listSearchCpCarloadConstructionLine(params) {
//   return request('/api/Beauty/beauty/cpCarloadConstructionForm/getCpCarloadConstructionFormLine', {
//     method: 'POST',
//     body: params,
//   });
// }

// //分页查询
// export async function listCpAssemblyBuild(params) {
//   return request(`/api/Beauty/beauty/cpAssemblyBuild/getCpAssemblyBuildList`,{
// 		method: 'POST',
// 		body: params,
//   });
// }

// //新增或修改
// export async function addCpAssemblyBuild(params) {
//   return request('/api/Beauty/beauty/cpAssemblyBuild/postCpAssemblyBuild', {
// 		method: 'POST',
// 		body: params,
//   });
// }

// //单个删除
// export async function deleteCpAssemblyBuild(params) {
//   return request('/api/Beauty/beauty/cpAssemblyBuild/deleteCpAssemblyBuild', {
//      method: 'POST',
//      body: params,
//   });
// }
// 总成建立
// 分页查询
export async function listCpAssemblyBuild(params) {
  return request(`/api/Beauty/beauty/cpAssemblyBuild/getCpAssemblyBuildList`, {
    method: 'POST',
    body: params,
  });
}

// 新增或修改
export async function addCpAssemblyBuild(params) {
  return request('/api/Beauty/beauty/cpAssemblyBuild/postCpAssemblyBuild', {
    method: 'POST',
    body: params,
  });
}

// 单个删除
export async function deleteCpAssemblyBuild(params) {
  return request('/api/Beauty/beauty/cpAssemblyBuild/deleteCpAssemblyBuild', {
    method: 'POST',
    body: params,
  });
}

// 获取详情
export async function getCpAssemblyBuild(params) {
  return request('/api/Beauty/beauty/cpAssemblyBuild/getCpAssemblyBuild', {
    method: 'POST',
    body: params,
  });
}

// 获取列详情
export async function getCpAssemblyBuildLine(params) {
  return request('/api/Beauty/beauty/cpAssemblyBuild/getCpAssemblyBuildLine', {
    method: 'POST',
    body: params,
  });
}
// 集采
// 分页查询
export async function listCpCollecClient(params) {
  return request(`/api/Beauty/beauty/cpCollecClient/getCpCollecClientList`, {
    method: 'POST',
    body: params,
  });
}

// 新增或修改
export async function addCpCollecClient(params) {
  return request('/api/Beauty/beauty/cpCollecClient/postCpCollecClient', {
    method: 'POST',
    body: params,
  });
}

// 单个删除
export async function deleteCpCollecClient(params) {
  return request('/api/Beauty/beauty/cpCollecClient/deleteCpCollecClient', {
    method: 'POST',
    body: params,
  });
}

// 获取详情
export async function getCpCollecClient(params) {
  return request('/api/Beauty/beauty/cpCollecClient/getCpCollecClient', {
    method: 'POST',
    body: params,
  });
}

// 获取列详情
export async function getCpCollecClientLine(params) {
  return request('/api/Beauty/beauty/cpCollecClient/getCpCollecClientLine', {
    method: 'POST',
    body: params,
  });
}

// 集采编码
// 分页查询
export async function listCpCollecCode(params) {
  return request(`/api/Beauty/beauty/cpCollecCode/getCpCollecCodeList`, {
    method: 'POST',
    body: params,
  });
}

// 新增或修改
export async function addCpCollecCode(params) {
  return request('/api/Beauty/beauty/cpCollecCode/postCpCollecCode', {
    method: 'POST',
    body: params,
  });
}

// 单个删除
export async function deleteCpCollecCode(params) {
  return request('/api/Beauty/beauty/cpCollecCode/deleteCpCollecCode', {
    method: 'POST',
    body: params,
  });
}

// 获取详情
export async function getCpCollecCode(params) {
  return request('/api/Beauty/beauty/cpCollecCode/getCpCollecCode', {
    method: 'POST',
    body: params,
  });
}

// 获取列详情
export async function getCpCollecCodeLine(params) {
  return request('/api/Beauty/beauty/cpCollecCode/getCpCollecCodeLine', {
    method: 'POST',
    body: params,
  });
}
//资料查询不需要权限
export async function getCpBillMaterialListNo(params) {
  return request(`/api/Beauty/beauty/cpBillMaterial/getCpBillMaterialListNo`, {
    method: 'POST',
    body: params,
  });
}

export async function getCpTypeListNo(params) {
  return request(`/api/Beauty/beauty/cpType/getCpTypeListNo`, {
    method: 'POST',
    body: params,
  });
}

// 扫码物料

// 新增删除
export async function updateBacth(params) {
  return request(`/api/Beauty/beauty/cpBillType/postCpBillType`, {
    method: 'POST',
    body: params,
  });
}

export async function deleteCpBillType(params) {
  return request(`/api/Beauty/beauty/cpBillType/deleteCpBillType`, {
    method: 'POST',
    body: params,
  });
}

// export async function updateBacth(params) {
//   return request(`/api/Beauty/beauty/cpBillMaterial/updateParent`,{
// 		method: 'POST',
// 		body: params,
//   });
// }

// export async function updateBacth(params) {
//   return request(`/api/Beauty/beauty/cpBillMaterial/updateBacth`,{
// 		method: 'POST',
// 		body: params,
//   });
// }

// 列表
export async function getCpBillMaterialList(params) {
  return request(`/api/Beauty/beauty/cpBillMaterial/getCpBillMaterialList`, {
    method: 'POST',
    body: params,
  });
}

// 物料

export async function getCpBillMaterialAll(params) {
  return request(`/api/Beauty/beauty/cpBillMaterial/getCpBillMaterialAll`, {
    method: 'POST',
    body: params,
  });
}

export async function listCpBillMaterial(params) {
  return request(`/api/Beauty/beauty/cpBillMaterial/getCpBillMaterialList`, {
    method: 'POST',
    body: params,
  });
}

export async function addCpBillMaterial(params) {
  return request('/api/Beauty/beauty/cpBillMaterial/postCpBillMaterial', {
    method: 'POST',
    body: params,
  });
}

export async function updateCpBillMaterial(params) {
  return request('/api/Beauty/beauty/cpBillMaterial/updateCpBillMaterial', {
    method: 'POST',
    body: params,
  });
}

export async function listNotPageCpBillMaterial(params) {
  return request('/api/Beauty/beauty/cpBillMaterial/getCpBillMaterialListNoPage', {
    method: 'POST',
    body: params,
  });
}

export async function deleteCpBillMaterial(params) {
  return request('/api/Beauty/beauty/cpBillMaterial/deleteCpBillMaterial', {
    method: 'POST',
    body: params,
  });
}

export async function getCpBillMaterial(params) {
  return request('/api/Beauty/beauty/cpBillMaterial/getCpBillMaterial', {
    method: 'POST',
    body: params,
  });
}

export async function listCpBillMaterialTreeData(params) {
  return request('/api/Beauty/beauty/cpBillMaterial/treeData', {
    method: 'POST',
    body: params,
  });
}

// 总成施工单

export async function cpAtWorkFormupdate(params) {
  return request(`/api/Beauty/beauty/cpAtWorkForm/update`, {
    method: 'POST',
    body: params,
  });
}

export async function cpAtWorkFormRevocation(params) {
  return request(`/api/Beauty/beauty/cpAtWorkForm/revocation`, {
    method: 'POST',
    body: params,
  });
}

// 分页查询
export async function listCpAtWorkForm(params) {
  return request(`/api/Beauty/beauty/cpAtWorkForm/getCpAtWorkFormList`, {
    method: 'POST',
    body: params,
  });
}

// 新增或修改
export async function addCpAtWorkForm(params) {
  return request('/api/Beauty/beauty/cpAtWorkForm/postCpAtWorkForm', {
    method: 'POST',
    body: params,
  });
}

// 单个删除
export async function deleteCpAtWorkForm(params) {
  return request('/api/Beauty/beauty/cpAtWorkForm/deleteCpAtWorkForm', {
    method: 'POST',
    body: params,
  });
}

// 获取详情
export async function getCpAtWorkForm(params) {
  return request('/api/Beauty/beauty/cpAtWorkForm/getCpAtWorkForm', {
    method: 'POST',
    body: params,
  });
}

// 获取列详情
export async function getCpAtWorkFormLine(params) {
  return request('/api/Beauty/beauty/cpAtWorkForm/getCpAtWorkFormLine', {
    method: 'POST',
    body: params,
  });
}

// 一级编码
// 分页查询
export async function listCpOneCode(params) {
  return request(`/api/Beauty/beauty/cpOneCode/getCpOneCodeList`, {
    method: 'POST',
    body: params,
  });
}

// 新增或修改
export async function addCpOneCode(params) {
  return request('/api/Beauty/beauty/cpOneCode/postCpOneCode', {
    method: 'POST',
    body: params,
  });
}

// 单个删除
export async function deleteCpOneCode(params) {
  return request('/api/Beauty/beauty/cpOneCode/deleteCpOneCode', {
    method: 'POST',
    body: params,
  });
}

//获取详情
export async function getCpOneCode(params) {
  return request('/api/Beauty/beauty/cpOneCode/getCpOneCode', {
    method: 'POST',
    body: params,
  });
}

// 获取列详情
export async function getCpOneCodeLine(params) {
  return request('/api/Beauty/beauty/cpOneCode/getCpOneCodeLine', {
    method: 'POST',
    body: params,
  });
}

// 二级编码
// 分页查询
export async function listCpTwoCode(params) {
  return request(`/api/Beauty/beauty/cpTwoCode/getCpTwoCodeList`, {
    method: 'POST',
    body: params,
  });
}

// 新增或修改
export async function addCpTwoCode(params) {
  return request('/api/Beauty/beauty/cpTwoCode/postCpTwoCode', {
    method: 'POST',
    body: params,
  });
}

// 单个删除
export async function deleteCpTwoCode(params) {
  return request('/api/Beauty/beauty/cpTwoCode/deleteCpTwoCode', {
    method: 'POST',
    body: params,
  });
}

// 获取详情
export async function getCpTwoCode(params) {
  return request('/api/Beauty/beauty/cpTwoCode/getCpTwoCode', {
    method: 'POST',
    body: params,
  });
}

// 获取列详情
export async function getCpTwoCodeLine(params) {
  return request('/api/Beauty/beauty/cpTwoCode/getCpTwoCodeLine', {
    method: 'POST',
    body: params,
  });
}
// 待报件清单

export async function cpPendingSingelFormupdate(params) {
  return request(`/api/Beauty/beauty/cpPendingSingelForm/update`, {
    method: 'POST',
    body: params,
  });
}

// 修改明细单行
export async function cpBillSingelSave(params) {
  return request(`/api/Beauty/beauty/cpBillSingel/save`, {
    method: 'POST',
    body: params,
  });
}

export async function listCpPendingSingelForm(params) {
  return request(`/api/Beauty/beauty/cpPendingSingelForm/getCpPendingSingelFormList`, {
    method: 'POST',
    body: params,
  });
}

export async function addCpPendingSingelForm(params) {
  return request('/api/Beauty/beauty/cpPendingSingelForm/postCpPendingSingelForm', {
    method: 'POST',
    body: params,
  });
}

export async function updateCpPendingSingelForm(params) {
  return request('/api/Beauty/beauty/cpPendingSingelForm/updateCpPendingSingelForm', {
    method: 'POST',
    body: params,
  });
}

export async function listNotPageCpPendingSingelForm(params) {
  return request('/api/Beauty/beauty/cpPendingSingelForm/getCpPendingSingelFormListNoPage', {
    method: 'POST',
    body: params,
  });
}

export async function cpPendingSingeldel(params) {
  return request('/api/Beauty/beauty/cpBillSingel/deleteCpBillSingel', {
    method: 'POST',
    body: params,
  });
}

export async function deleteCpPendingSingelForm(params) {
  return request('/api/Beauty/beauty/cpPendingSingelForm/deleteCpPendingSingelForm', {
    method: 'POST',
    body: params,
  });
}

export async function getCpPendingSingelForm(params) {
  return request('/api/Beauty/beauty/cpPendingSingelForm/getCpPendingSingelForm', {
    method: 'POST',
    body: params,
  });
}

export async function listCpPendingSingelFormTreeData(params) {
  return request('/api/Beauty/beauty/cpPendingSingelForm/treeData', {
    method: 'POST',
    body: params,
  });
}

export async function getcpPendingSingelFormLine(params) {
  return request('/api/Beauty/beauty/cpPendingSingelForm/getCpPendingSingelFormLine', {
    method: 'POST',
    body: params,
  });
}

export async function cpPendingSingelFormsave(params) {
  return request('/api/Beauty/beauty/cpPendingSingelForm/save', {
    method: 'POST',
    body: params,
  });
}

// 审核
export async function cpPendingSingelFormisPass(params) {
  return request('/api/Beauty/beauty/cpPendingSingelForm/isPass', {
    method: 'POST',
    body: params,
  });
}

//  撤销
export async function cpPendingSingelFormrevocation(params) {
  return request('/api/Beauty/beauty/cpPendingSingelForm/revocation', {
    method: 'POST',
    body: params,
  });
}

// 报件单

// 分页查询
export async function cpSingelFormupdate(params) {
  return request(`/api/Beauty/beauty/cpSingelForm/update`, {
    method: 'POST',
    body: params,
  });
}

// 分页查询
export async function listCpSingelForm(params) {
  return request(`/api/Beauty/beauty/cpSingelForm/getCpSingelFormList`, {
    method: 'POST',
    body: params,
  });
}

// 是否报件
export async function postCpSingelForm(params) {
  return request('/api/Beauty/beauty/cpSingelForm/postCpSingelForm', {
    method: 'POST',
    body: params,
  });
}

// 提交
export async function addCpSingelForm(params) {
  return request('/api/Beauty/beauty/cpSingelForm/cpSingelFormSubmit', {
    method: 'POST',
    body: params,
  });
}

// 保存
export async function CpSingelFormSave(params) {
  return request('/api/Beauty/beauty/cpSingelForm/save', {
    method: 'POST',
    body: params,
  });
}

// 审核
export async function cpSingelFormisPass(params) {
  return request('/api/Beauty/beauty/cpSingelForm/isPass', {
    method: 'POST',
    body: params,
  });
}

// 重新提交
export async function CpSingelFormResubmit(params) {
  return request('/api/Beauty/beauty/cpSingelForm/resubmit', {
    method: 'POST',
    body: params,
  });
}

// 单个删除
export async function deleteCpSingelForm(params) {
  return request('/api/Beauty/beauty/cpSingelForm/deleteCpSingelForm', {
    method: 'POST',
    body: params,
  });
}

// 获取详情
export async function getCpSingelForm(params) {
  return request('/api/Beauty/beauty/cpSingelForm/getCpSingelForm', {
    method: 'POST',
    body: params,
  });
}

// 获取列详情
export async function getCpSingelFormLine(params) {
  return request('/api/Beauty/beauty/cpSingelForm/getCpSingelFormLine', {
    method: 'POST',
    body: params,
  });
}

// 报件单撤销
export async function getCpSingelFormRevocation(params) {
  return request('/api/Beauty/beauty/cpSingelForm/revocation', {
    method: 'POST',
    body: params,
  });
}

// 报价单

// 添加物料明细
export async function updateCpBillSingel(params) {
  return request(`/api/Beauty/beauty/cpBillSingel/updateCpBillSingel`, {
    method: 'POST',
    body: params,
  });
}

// 分页查询
export async function cpOfferFormupdate(params) {
  return request(`/api/Beauty/beauty/cpOfferForm/update`, {
    method: 'POST',
    body: params,
  });
}

// 分页查询
export async function listCpOfferForm(params) {
  return request(`/api/Beauty/beauty/cpOfferForm/getCpOfferFormList`, {
    method: 'POST',
    body: params,
  });
}

// 新增或修改
export async function updateCpOfferForm(params) {
  return request('/api/Beauty/beauty/cpOfferForm/updateCpOfferForm', {
    method: 'POST',
    body: params,
  });
}

export async function addCpOfferForm(params) {
  return request('/api/Beauty/beauty/cpOfferForm/postCpOfferForm', {
    method: 'POST',
    body: params,
  });
}

// 单个删除
export async function deleteCpOfferForm(params) {
  return request('/api/Beauty/beauty/cpOfferForm/deleteCpOfferForm', {
    method: 'POST',
    body: params,
  });
}

// 获取详情
export async function getCpOfferForm(params) {
  return request('/api/Beauty/beauty/cpOfferForm/getCpOfferForm', {
    method: 'POST',
    body: params,
  });
}

// 获取列详情
export async function getCpOfferFormLine(params) {
  return request('/api/Beauty/beauty/cpOfferForm/getCpOfferFormLine', {
    method: 'POST',
    body: params,
  });
}

// 分页查询物料管理中间管理
export async function getCpBillSingelList(params) {
  return request('/api/Beauty/beauty/cpBillSingel/getCpBillSingelList', {
    method: 'POST',
    body: params,
  });
}
// 新增
export async function postCpBillSingel(params) {
  return request('/api/Beauty/beauty/cpBillSingel/postCpBillSingel', {
    method: 'POST',
    body: params,
  });
}
// 删除
export async function deleteCpBillSingel(params) {
  return request('/api/Beauty/beauty/cpBillSingel/deleteCpBillSingel', {
    method: 'POST',
    body: params,
  });
}
// 报价单明细

export async function getZhCpBillSingelList(params) {
  return request('/api/Beauty/beauty/cpBillSingel/getZhCpBillSingelList', {
    method: 'POST',
    body: params,
  });
}

// 新增
export async function postCpOfferDetail(params) {
  return request('/api/Beauty/beauty/cpOfferDetail/postCpOfferDetail', {
    method: 'POST',
    body: params,
  });
}

// 报价单保存
export async function cpOfferFormonsave(params) {
  return request('/api/Beauty/beauty/cpOfferForm/save', {
    method: 'POST',
    body: params,
  });
}
// 查询
export async function getCpOfferDetailList(params) {
  return request('/api/Beauty/beauty/cpOfferDetail/getCpOfferDetailList', {
    method: 'POST',
    body: params,
  });
}

// 删除
export async function deleteCpOfferDetail(params) {
  return request('/api/Beauty/beauty/cpOfferDetail/deleteCpOfferDetail', {
    method: 'POST',
    body: params,
  });
}
// 报价单 结算单

export async function cpOfferFormrevocationJS(params) {
  return request('/api/Beauty/beauty/cpOfferForm/revocationJS', {
    method: 'POST',
    body: params,
  });
}
//报价单撤销
export async function jscpOfferFormrevocation(params) {
  return request('/api/Beauty/beauty/cpOfferForm/revocation', {
    method: 'POST',
    body: params,
  });
}

export async function isPass(params) {
  return request('/api/Beauty/beauty/cpOfferForm/isPass', {
    method: 'POST',
    body: params,
  });
}
// 报价单 重新提交
export async function cpOfferFormRevocation(params) {
  return request('/api/Beauty/beauty/cpOfferForm/resubmit', {
    method: 'POST',
    body: params,
  });
}
// 待处理报件单 重新提交
export async function cpPendingSingelFormresubmit(params) {
  return request('/api/Beauty/beauty/cpPendingSingelForm/resubmit', {
    method: 'POST',
    body: params,
  });
}

// 盘点单
///

export async function listTestOffice(params) {
  return request('/api/Beauty/test/testOffice/getTestOfficeList', {
    method: 'POST',
    body: params,
  });
}

export async function addTestOffice(params) {
  return request('/api/Beauty/test/testOffice/postTestOffice', {
    method: 'POST',
    body: params,
  });
}

export async function updateTestOffice(params) {
  return request('/api/Beauty/test/testOffice/updateTestOffice', {
    method: 'POST',
    body: params,
  });
}

export async function listNotPageTestOffice(params) {
  return request('/api/Beauty/test/testOffice/getTestOfficeListNoPage', {
    method: 'POST',
    body: params,
  });
}

export async function deleteTestOffice(params) {
  return request('/api/Beauty/test/testOffice/deleteTestOffice', {
    method: 'POST',
    body: params,
  });
}

export async function getTestOffice(params) {
  return request('/api/Beauty/test/testOffice/getTestOffice', {
    method: 'POST',
    body: params,
  });
}

export async function listTestOfficeTreeData(params) {
  return request('/api/Beauty/test/testOffice/treeData', {
    method: 'POST',
    body: params,
  });
}

export async function listDict(params) {
  return request('/api/Beauty/sys/dict/listData', {
    method: 'POST',
    body: params,
  });
}

// 业务委托单
export async function cpBusinessOrderupdate(params) {
  return request(`/api/Beauty/beauty/cpBusinessOrder/update`, {
    method: 'POST',
    body: params,
  });
}

export async function listCpBusinessOrder(params) {
  return request(`/api/Beauty/beauty/cpBusinessOrder/getCpBusinessOrderList`, {
    method: 'POST',
    body: params,
  });
}

export async function addCpBusinessOrder(params) {
  return request('/api/Beauty/beauty/cpBusinessOrder/postCpBusinessOrder', {
    method: 'POST',
    body: params,
  });
}

export async function updateCpBusinessOrder(params) {
  return request('/api/Beauty/beauty/cpBusinessOrder/updateCpBusinessOrder', {
    method: 'POST',
    body: params,
  });
}

export async function listNotPageCpBusinessOrder(params) {
  return request('/api/Beauty/beauty/cpBusinessOrder/getCpBusinessOrderListNoPage', {
    method: 'POST',
    body: params,
  });
}

export async function deleteCpBusinessOrder(params) {
  return request('/api/Beauty/beauty/cpBusinessOrder/deleteCpBusinessOrder', {
    method: 'POST',
    body: params,
  });
}

export async function getCpBusinessOrder(params) {
  return request('/api/Beauty/beauty/cpBusinessOrder/getCpBusinessOrder', {
    method: 'POST',
    body: params,
  });
}

export async function listCpBusinessOrderTreeData(params) {
  return request('/api/Beauty/beauty/cpBusinessOrder/treeData', {
    method: 'POST',
    body: params,
  });
}

// 配件内部订单

export async function interiordelCpBillSingel(params) {
  return request(`/api/Beauty/beauty/cpBillSingel/deleteCpBillSingel`, {
    method: 'POST',
    body: params,
  });
}

export async function interiorupdate(params) {
  return request(`/api/Beauty/beauty/interior/update`, {
    method: 'POST',
    body: params,
  });
}

export async function listinterior(params) {
  return request(`/api/Beauty/beauty/interior/getCpBusinessOrderList`, {
    method: 'POST',
    body: params,
  });
}

export async function addCpinterior(params) {
  return request('/api/Beauty/beauty/interior/postCpBusinessOrder', {
    method: 'POST',
    body: params,
  });
}

export async function updateinterior(params) {
  return request('/api/Beauty/beauty/interior/updateCpBusinessOrder', {
    method: 'POST',
    body: params,
  });
}

export async function listNotPageinteriorr(params) {
  return request('/api/Beauty/beauty/interior/getCpBusinessOrderListNoPage', {
    method: 'POST',
    body: params,
  });
}

export async function deleteinterior(params) {
  return request('/api/Beauty/beauty/interior/deleteCpBusinessOrder', {
    method: 'POST',
    body: params,
  });
}

export async function getinterior(params) {
  return request('/api/Beauty/beauty/interior/getCpBusinessOrder', {
    method: 'POST',
    body: params,
  });
}

export async function listinteriorTreeData(params) {
  return request('/api/Beauty/beauty/interior/treeData', {
    method: 'POST',
    body: params,
  });
}

// 分页查询
export async function listCpStayForm(params) {
  return request(`/api/Beauty/beauty/cpStayForm/getCpStayFormList`, {
    method: 'POST',
    body: params,
  });
}

// 新增或修改
export async function addCpStayForm(params) {
  return request('/api/Beauty/beauty/cpStayForm/postCpStayForm', {
    method: 'POST',
    body: params,
  });
}

// 单个删除
export async function deleteCpStayForm(params) {
  return request('/api/Beauty/beauty/cpStayForm/deleteCpStayForm', {
    method: 'POST',
    body: params,
  });
}

// 获取详情
export async function getCpStayForm(params) {
  return request('/api/Beauty/beauty/cpStayForm/getCpStayForm', {
    method: 'POST',
    body: params,
  });
}

// 获取列详情
export async function getCpStayFormLine(params) {
  return request('/api/Beauty/beauty/cpStayForm/getCpStayFormLine', {
    method: 'POST',
    body: params,
  });
}

// 新建区域
export async function saveArea(params) {
  return request('/api/Beauty/sys/dict/saveArea', {
    method: 'POST',
    body: params,
  });
}

// //区域
// export async function saveArea(params) {
//   return request('/api/Beauty/sys/dict/saveArea',{
//      method: 'POST',
//      body: params,
//   });
// }

// 配件订单管理

// 删除明细
export async function deleteAccesssoriesSales(params) {
  return request('/api/Beauty/beauty/cpPurchaseDetail/deleteAccesssoriesSales', {
    method: 'POST',
    body: params,
  });
}

// 新增明细
export async function updateAccessoriSales(params) {
  return request('/api/Beauty/beauty/cpPurchaseDetail/updateAccessoriSales', {
    method: 'POST',
    body: params,
  });
}

// 配件销售订单

export async function listCpAccessoriesSalesForm(params) {
  return request(`/api/Beauty/beauty/cpAccessoriesSalesForm/getCpAccessoriesSalesFormList`, {
    method: 'POST',
    body: params,
  });
}

// 新增或修改
export async function addCpAccessoriesSalesForm(params) {
  return request('/api/Beauty/beauty/cpAccessoriesSalesForm/postCpAccessoriesSalesForm', {
    method: 'POST',
    body: params,
  });
}

// 单个删除
export async function deleteCpAccessoriesSalesForm(params) {
  return request('/api/Beauty/beauty/cpAccessoriesSalesForm/deleteCpAccessoriesSalesForm', {
    method: 'POST',
    body: params,
  });
}

// 获取详情
export async function getCpAccessoriesSalesForm(params) {
  return request('/api/Beauty/beauty/cpAccessoriesSalesForm/getCpAccessoriesSalesForm', {
    method: 'POST',
    body: params,
  });
}

// 获取列详情
export async function getCpAccessoriesSalesFormLine(params) {
  return request('/api/Beauty/beauty/cpAccessoriesSalesForm/getCpAccessoriesSalesFormLine', {
    method: 'POST',
    body: params,
  });
}

// 撤销配件销售
export async function revocationCpAccessoriesSalesForm(params) {
  return request('/api/Beauty/beauty/cpAccessoriesSalesForm/revocation', {
    method: 'POST',
    body: params,
  });
}

//待销售清单

export async function postBatchStayMarketFrom(params) {
  return request('/api/Beauty/beauty/stayMarketFrom/postBatchStayMarketFrom', {
    method: 'POST',
    body: params,
  });
}

export async function getStayMarketFromList(params) {
  return request('/api/Beauty/beauty/stayMarketFrom/getStayMarketFromList', {
    method: 'POST',
    body: params,
  });
}

export async function postStayMarketFrom(params) {
  return request('/api/Beauty/beauty/stayMarketFrom/postStayMarketFrom', {
    method: 'POST',
    body: params,
  });
}

export async function updateStayMarketFrom(params) {
  return request('/api/Beauty/beauty/stayMarketFrom/updateStayMarketFrom', {
    method: 'POST',
    body: params,
  });
}

export async function deleteStayMarketFrom(params) {
  return request('/api/Beauty/beauty/stayMarketFrom/deleteStayMarketFrom', {
    method: 'POST',
    body: params,
  });
}

// 配件施工单
export async function cpAccessoriesWorkFormupdate(params) {
  return request(`/api/Beauty/beauty/cpAccessoriesWorkForm/update`, {
    method: 'POST',
    body: params,
  });
}

// 分页查询
export async function listCpAccessoriesWorkForm(params) {
  return request(`/api/Beauty/beauty/cpAccessoriesWorkForm/getCpAccessoriesWorkFormList`, {
    method: 'POST',
    body: params,
  });
}

// 新增或修改
export async function addCpAccessoriesWorkForm(params) {
  return request('/api/Beauty/beauty/cpAccessoriesWorkForm/postCpAccessoriesWorkForm', {
    method: 'POST',
    body: params,
  });
}

// 单个删除
export async function deleteCpAccessoriesWorkForm(params) {
  return request('/api/Beauty/beauty/cpAccessoriesWorkForm/deleteCpAccessoriesWorkForm', {
    method: 'POST',
    body: params,
  });
}

// 获取详情
export async function getCpAccessoriesWorkForm(params) {
  return request('/api/Beauty/beauty/cpAccessoriesWorkForm/getCpAccessoriesWorkForm', {
    method: 'POST',
    body: params,
  });
}

// 获取列详情
export async function getCpAccessoriesWorkFormLine(params) {
  return request('/api/Beauty/beauty/cpAccessoriesWorkForm/getCpAccessoriesWorkFormLine', {
    method: 'POST',
    body: params,
  });
}

// 撤销
export async function getCpAccessoriesWorkRevocation(params) {
  return request('/api/Beauty/beauty/cpAccessoriesWorkForm/revocation', {
    method: 'POST',
    body: params,
  });
}

// 配件调拨单

// 删除明细
export async function cpAccessoriesdelete(params) {
  return request(`/api/Beauty/beauty/cpPurchaseDetail/delete`, {
    method: 'POST',
    body: params,
  });
}
// 新增明细
export async function updatePJFromDetail(params) {
  return request(`/api/Beauty/beauty/cpPurchaseDetail/updatePJFromDetail`, {
    method: 'POST',
    body: params,
  });
}

// 分页查询
export async function pjlistAll(params) {
  return request('/api/Beauty/sys/office/listAll', {
    method: 'POST',
    body: params,
  });
}

// 分页查询
export async function cpAccessoriesAllotupdate(params) {
  return request(`/api/Beauty/beauty/cpAccessoriesAllot/update`, {
    method: 'POST',
    body: params,
  });
}

// 分页查询
export async function listCpAccessoriesAllot(params) {
  return request(`/api/Beauty/beauty/cpAccessoriesAllot/getCpAccessoriesAllotList`, {
    method: 'POST',
    body: params,
  });
}

// 新增或修改
export async function addCpAccessoriesAllot(params) {
  return request('/api/Beauty/beauty/cpAccessoriesAllot/postCpAccessoriesAllot', {
    method: 'POST',
    body: params,
  });
}

// 单个删除
export async function deleteCpAccessoriesAllot(params) {
  return request('/api/Beauty/beauty/cpAccessoriesAllot/deleteCpAccessoriesAllot', {
    method: 'POST',
    body: params,
  });
}

// 获取详情
export async function getCpAccessoriesAllot(params) {
  return request('/api/Beauty/beauty/cpAccessoriesAllot/getCpAccessoriesAllot', {
    method: 'POST',
    body: params,
  });
}

// 获取列详情
export async function getCpAccessoriesAllotLine(params) {
  return request('/api/Beauty/beauty/cpAccessoriesAllot/getCpAccessoriesAllotLine', {
    method: 'POST',
    body: params,
  });
}

// 撤销
export async function cpAccessoriesAllotRevocation(params) {
  return request('/api/Beauty/beauty/cpAccessoriesAllot/revocation', {
    method: 'POST',
    body: params,
  });
}

// 售后历史单

//列表
export async function cpAfterApplicationFromHistory(params) {
  return request(`/api/Beauty/beauty/cpAfterApplicationFromHistory/getCpAfterApplicationFromList`, {
    method: 'POST',
    body: params,
  });
}

// 售后申请单

export async function ApplicationFrogetCpOfferForm(params) {
  return request(`/api/Beauty/beauty/cpOfferForm/getCpOfferForm`, {
    method: 'POST',
    body: params,
  });
}

// beauty/cpBusinessOrder/complete
export async function cpAfterApplicationFromHistoryupdate(params) {
  return request(`/api/Beauty/beauty/cpAfterApplicationFromHistory/update`, {
    method: 'POST',
    body: params,
  });
}

export async function saveCpAfterApplicationFromHistory(params) {
  return request('/api/Beauty/beauty/cpAfterApplicationFromHistory/save', {
    method: 'POST',
    body: params,
  });
}

// 新增或修改
export async function addCpAfterApplicationFromHistory(params) {
  return request('/api/Beauty/beauty/cpAfterApplicationFromHistory/postCpAfterApplicationFrom', {
    method: 'POST',
    body: params,
  });
}

// 单个删除
export async function deleteCpAfterApplicationFromHistory(params) {
  return request('/api/Beauty/beauty/cpAfterApplicationFromHistory/deleteCpAfterApplicationFrom', {
    method: 'POST',
    body: params,
  });
}

// 获取详情
export async function getCpAfterApplicationFromHistory(params) {
  return request('/api/Beauty/beauty/cpAfterApplicationFromHistory/getCpAfterApplicationFrom', {
    method: 'POST',
    body: params,
  });
}

// 获取列详情
export async function CpAfterApplicationFromHistoryLine(params) {
  return request('/api/Beauty/beauty/cpAfterApplicationFromHistory/getCpAfterApplicationFromLine', {
    method: 'POST',
    body: params,
  });
}
// 撤销
export async function CpAfterApplicationFromHistoryRevocation(params) {
  return request('/api/Beauty/beauty/cpAfterApplicationFromHistory/revocation', {
    method: 'POST',
    body: params,
  });
}

// 撤回
export async function CpAfterApplicationFromHistoryResubmit(params) {
  return request('/api/Beauty/beauty/cpAfterApplicationFromHistory/resubmit', {
    method: 'POST',
    body: params,
  });
}

// 审核
export async function CpAfterApplicationFromHistoryisPass(params) {
  return request('/api/Beauty/beauty/cpAfterApplicationFromHistory/isPass', {
    method: 'POST',
    body: params,
  });
}

// 分页查询
export async function listCpAfterApplicationFrom(params) {
  return request(`/api/Beauty/beauty/cpAfterApplicationFrom/getCpAfterApplicationFromList`, {
    method: 'POST',
    body: params,
  });
}
// 选择委托单查询

export async function selectComplete(params) {
  return request(`/api/Beauty/beauty/cpOfferForm/complete`, {
    method: 'POST',
    body: params,
  });
}

// export async function selectComplete(params) {
//   return request(`/api/Beauty/beauty/cpBusinessOrder/complete`,{
// 		method: 'POST',
// 		body: params,
//   });
// }

// 保存
export async function saveCpAfterApplication(params) {
  return request('/api/Beauty/beauty/cpAfterApplicationFrom/save', {
    method: 'POST',
    body: params,
  });
}

// 新增或修改
export async function addCpAfterApplicationFrom(params) {
  return request('/api/Beauty/beauty/cpAfterApplicationFrom/postCpAfterApplicationFrom', {
    method: 'POST',
    body: params,
  });
}

// 单个删除
export async function deleteCpAfterApplicationFrom(params) {
  return request('/api/Beauty/beauty/cpAfterApplicationFrom/deleteCpAfterApplicationFrom', {
    method: 'POST',
    body: params,
  });
}

// 获取详情
export async function getCpAfterApplicationFrom(params) {
  return request('/api/Beauty/beauty/cpAfterApplicationFrom/getCpAfterApplicationFrom', {
    method: 'POST',
    body: params,
  });
}

// 获取列详情
export async function getCpAfterApplicationFromLine(params) {
  return request('/api/Beauty/beauty/cpAfterApplicationFrom/getCpAfterApplicationFromLine', {
    method: 'POST',
    body: params,
  });
}
// 撤销
export async function cpAfterApplicationRevocation(params) {
  return request('/api/Beauty/beauty/cpAfterApplicationFrom/revocation', {
    method: 'POST',
    body: params,
  });
}

// 撤回
export async function cpAfterApplicationResubmit(params) {
  return request('/api/Beauty/beauty/cpAfterApplicationFrom/resubmit', {
    method: 'POST',
    body: params,
  });
}

// 审核
export async function cpAfterApplicationisPass(params) {
  return request('/api/Beauty/beauty/cpAfterApplicationFrom/isPass', {
    method: 'POST',
    body: params,
  });
}

// 售后委托单

export async function cpAfterEntrustFromupdate(params) {
  return request(`/api/Beauty/beauty/cpAfterEntrustFrom/update`, {
    method: 'POST',
    body: params,
  });
}

// 分页查询
export async function listCpAfterEntrustFrom(params) {
  return request(`/api/Beauty/beauty/cpAfterEntrustFrom/getCpAfterEntrustFromList`, {
    method: 'POST',
    body: params,
  });
}

// 新增或修改
export async function addCpAfterEntrustFrom(params) {
  return request('/api/Beauty/beauty/cpAfterEntrustFrom/postCpAfterEntrustFrom', {
    method: 'POST',
    body: params,
  });
}

// 单个删除
export async function deleteCpAfterEntrustFrom(params) {
  return request('/api/Beauty/beauty/cpAfterEntrustFrom/deleteCpAfterEntrustFrom', {
    method: 'POST',
    body: params,
  });
}

// 获取详情
export async function getCpAfterEntrustFrom(params) {
  return request('/api/Beauty/beauty/cpAfterEntrustFrom/getCpAfterEntrustFrom', {
    method: 'POST',
    body: params,
  });
}

// 获取列详情
export async function getCpAfterEntrustFromLine(params) {
  return request('/api/Beauty/beauty/cpAfterEntrustFrom/getCpAfterEntrustFromLine', {
    method: 'POST',
    body: params,
  });
}

// 撤销
export async function cpAfterEntrustRevocation(params) {
  return request('/api/Beauty/beauty/cpAfterEntrustFrom/revocation', {
    method: 'POST',
    body: params,
  });
}

// 审核
export async function cpAfterEntrustisPass(params) {
  return request('/api/Beauty/beauty/cpAfterEntrustFrom/isPass', {
    method: 'POST',
    body: params,
  });
}

// 售后施工单

export async function cpAfterSgFromrevocation(params) {
  return request(`/api/Beauty/beauty/cpAfterSgFrom/revocation`, {
    method: 'POST',
    body: params,
  });
}

export async function cpAfterSgFromupdate(params) {
  return request(`/api/Beauty/beauty/cpAfterSgFrom/update`, {
    method: 'POST',
    body: params,
  });
}

// 分页查询
export async function listCpAfterSgFrom(params) {
  return request(`/api/Beauty/beauty/cpAfterSgFrom/getCpAfterSgFromList`, {
    method: 'POST',
    body: params,
  });
}

// 新增或修改
export async function addCpAfterSgFrom(params) {
  return request('/api/Beauty/beauty/cpAfterSgFrom/postCpAfterSgFrom', {
    method: 'POST',
    body: params,
  });
}

// 单个删除
export async function deleteCpAfterSgFrom(params) {
  return request('/api/Beauty/beauty/cpAfterSgFrom/deleteCpAfterSgFrom', {
    method: 'POST',
    body: params,
  });
}

// 获取详情
export async function getCpAfterSgFrom(params) {
  return request('/api/Beauty/beauty/cpAfterSgFrom/getCpAfterSgFrom', {
    method: 'POST',
    body: params,
  });
}

// 获取列详情
export async function getCpAfterSgFromLine(params) {
  return request('/api/Beauty/beauty/cpAfterSgFrom/getCpAfterSgFromLine', {
    method: 'POST',
    body: params,
  });
}

// 金额变更申请单

// 请求应收金额
export async function getCpOfferFormChane(params) {
  return request('/api/Beauty/beauty/cpOfferForm/getCpOfferFormChane', {
    method: 'POST',
    body: params,
  });
}

// 配件金额变更
export async function getCpAccessoriesSalesFormAll(params) {
  return request('/api/Beauty/beauty/cpAccessoriesSalesForm/getCpAccessoriesSalesFormAll', {
    method: 'POST',
    body: params,
  });
}

// 撤销
export async function cpMoneyChangeRevocation(params) {
  return request('/api/Beauty/beauty/cpMoneyChange/revocation', {
    method: 'POST',
    body: params,
  });
}

// 重新提交
export async function cpMoneyChangeresubmit(params) {
  return request('/api/Beauty/beauty/cpMoneyChange/resubmit', {
    method: 'POST',
    body: params,
  });
}

// 审核
export async function cpMoneyChangeisPass(params) {
  return request('/api/Beauty/beauty/cpMoneyChange/isPass', {
    method: 'POST',
    body: params,
  });
}

// 分页查询
export async function listCpMoneyChange(params) {
  return request(`/api/Beauty/beauty/cpMoneyChange/getCpMoneyChangeList`, {
    method: 'POST',
    body: params,
  });
}

// 新增或修改
export async function addCpMoneyChange(params) {
  return request('/api/Beauty/beauty/cpMoneyChange/postCpMoneyChange', {
    method: 'POST',
    body: params,
  });
}

// 单个删除
export async function deleteCpMoneyChange(params) {
  return request('/api/Beauty/beauty/cpMoneyChange/deleteCpMoneyChange', {
    method: 'POST',
    body: params,
  });
}

// 获取详情
export async function getCpMoneyChange(params) {
  return request('/api/Beauty/beauty/cpMoneyChange/getCpMoneyChange', {
    method: 'POST',
    body: params,
  });
}

// 获取列详情
export async function getCpMoneyChangeLine(params) {
  return request('/api/Beauty/beauty/cpMoneyChange/getCpMoneyChangeLine', {
    method: 'POST',
    body: params,
  });
}

// 提交
export async function postCpMoneyChangesubmit(params) {
  return request('/api/Beauty/beauty/cpMoneyChange/submit', {
    method: 'POST',
    body: params,
  });
}

// 保存
export async function postCpMoneyChangesave(params) {
  return request('/api/Beauty/beauty/cpMoneyChange/save', {
    method: 'POST',
    body: params,
  });
}

// 金额变更审核单

//重新提交
export async function cpMoneyChangeAuditresubmit(params) {
  return request('/api/Beauty/beauty/cpMoneyChangeAudit/resubmit', {
    method: 'POST',
    body: params,
  });
}

// 分页查询
export async function listCpMoneyChangeAudit(params) {
  return request(`/api/Beauty/beauty/cpMoneyChangeAudit/getCpMoneyChangeAuditList`, {
    method: 'POST',
    body: params,
  });
}

// 新增或修改
export async function addCpMoneyChangeAudit(params) {
  return request('/api/Beauty/beauty/cpMoneyChangeAudit/postCpMoneyChangeAudit', {
    method: 'POST',
    body: params,
  });
}

// 单个删除
export async function deleteCpMoneyChangeAudit(params) {
  return request('/api/Beauty/beauty/cpMoneyChangeAudit/deleteCpMoneyChangeAudit', {
    method: 'POST',
    body: params,
  });
}

// 获取详情
export async function getCpMoneyChangeAudit(params) {
  return request('/api/Beauty/beauty/cpMoneyChangeAudit/getCpMoneyChangeAudit', {
    method: 'POST',
    body: params,
  });
}

// 获取列详情
export async function getCpMoneyChangeAuditLine(params) {
  return request('/api/Beauty/beauty/cpMoneyChangeAudit/getCpMoneyChangeAuditLine', {
    method: 'POST',
    body: params,
  });
}

// 提交
export async function postCpMoneyChangeAuditsubmit(params) {
  return request('/api/Beauty/beauty/cpMoneyChangeAudit/submit', {
    method: 'POST',
    body: params,
  });
}

// 保存
export async function postCpMoneyChangeAuditsave(params) {
  return request('/api/Beauty/beauty/cpMoneyChangeAudit/save', {
    method: 'POST',
    body: params,
  });
}

// 审核
export async function cpMoneyChangeAuditisPass(params) {
  return request('/api/Beauty/beauty/cpMoneyChangeAudit/isPass', {
    method: 'POST',
    body: params,
  });
}

// 撤销
export async function cpMoneyChangeAuditRevocation(params) {
  return request('/api/Beauty/beauty/cpMoneyChangeAudit/revocation', {
    method: 'POST',
    body: params,
  });
}

// 待出库清单

// 关闭启动状态
export async function updateCpOutbound(params) {
  return request('/api/Beauty/beauty/cpOutbound/updateCpOutbound', {
    method: 'POST',
    body: params,
  });
}

// 分页查询
export async function listCpOutbound(params) {
  return request(`/api/Beauty/beauty/cpOutbound/getCpOutboundList`, {
    method: 'POST',
    body: params,
  });
}

// 新增或修改
export async function addCpOutbound(params) {
  return request('/api/Beauty/beauty/cpOutbound/postCpOutbound', {
    method: 'POST',
    body: params,
  });
}

// 单个删除
export async function deleteCpOutbound(params) {
  return request('/api/Beauty/beauty/cpOutbound/deleteCpOutbound', {
    method: 'POST',
    body: params,
  });
}

// 获取详情
export async function getCpOutbound(params) {
  return request('/api/Beauty/beauty/cpOutbound/getCpOutbound', {
    method: 'POST',
    body: params,
  });
}

// 获取列详情
export async function getCpOutboundLine(params) {
  return request('/api/Beauty/beauty/cpOutbound/getCpOutboundLine', {
    method: 'POST',
    body: params,
  });
}

// 关闭启动
export async function updateCpPurchaseStockPending(params) {
  return request('/api/Beauty/beauty/cpPurchaseStockPending/updateCpPurchaseStockPending', {
    method: 'POST',
    body: params,
  });
}

// 入库
export async function postCpPurchaseStockPending(params) {
  return request('/api/Beauty/beauty/cpPurchaseStockPending/postCpPurchaseStockPending', {
    method: 'POST',
    body: params,
  });
}

// 撤销
export async function cpPurchaseStockPendingRevocation(params) {
  return request('/api/Beauty/beauty/cpPurchaseStockPending/revocation', {
    method: 'POST',
    body: params,
  });
}

// 供应商
// 分页查询
export async function listCpSupplier(params) {
  return request(`/api/Beauty/beauty/cpSupplier/getCpSupplierList`, {
    method: 'POST',
    body: params,
  });
}

// 新增或修改
export async function addCpSupplier(params) {
  return request('/api/Beauty/beauty/cpSupplier/postCpSupplier', {
    method: 'POST',
    body: params,
  });
}

// 单个删除
export async function deleteCpSupplier(params) {
  return request('/api/Beauty/beauty/cpSupplier/deleteCpSupplier', {
    method: 'POST',
    body: params,
  });
}

// 获取详情
export async function getCpSupplier(params) {
  return request('/api/Beauty/beauty/cpSupplier/getCpSupplier', {
    method: 'POST',
    body: params,
  });
}

// 获取列详情
export async function getCpSupplierLine(params) {
  return request('/api/Beauty/beauty/cpSupplier/getCpSupplierLine', {
    method: 'POST',
    body: params,
  });
}

// 供应商审核

// 重新提交
export async function cpSupplierAuditresubmit(params) {
  return request('/api/Beauty/beauty/cpSupplierAudit/resubmit', {
    method: 'POST',
    body: params,
  });
}

// 供应商保存
export async function cpSupplierAuditsave(params) {
  return request('/api/Beauty/beauty/cpSupplierAudit/save', {
    method: 'POST',
    body: params,
  });
}

// 分页查询
export async function listCpSupplierAudit(params) {
  return request(`/api/Beauty/beauty/cpSupplierAudit/getCpSupplierAuditList`, {
    method: 'POST',
    body: params,
  });
}

// 新增或修改
export async function addCpSupplierAudit(params) {
  return request('/api/Beauty/beauty/cpSupplierAudit/postCpSupplierAudit', {
    method: 'POST',
    body: params,
  });
}

// 单个删除
export async function deleteCpSupplierAudit(params) {
  return request('/api/Beauty/beauty/cpSupplierAudit/deleteCpSupplierAudit', {
    method: 'POST',
    body: params,
  });
}

// 获取详情
export async function getCpSupplierAudit(params) {
  return request('/api/Beauty/beauty/cpSupplierAudit/getCpSupplierAudit', {
    method: 'POST',
    body: params,
  });
}

// 获取列详情
export async function getCpSupplierAuditLine(params) {
  return request('/api/Beauty/beauty/cpSupplierAudit/getCpSupplierAuditLine', {
    method: 'POST',
    body: params,
  });
}
// 审核
export async function cpSupplierAuditispass(params) {
  return request('/api/Beauty/beauty/cpSupplierAudit/isPass', {
    method: 'POST',
    body: params,
  });
}

// 采购单

export async function cpPurchaseFromupdate(params) {
  return request(`/api/Beauty/beauty/cpPurchaseFrom/update`, {
    method: 'POST',
    body: params,
  });
}

// 分页查询
export async function listCpPurchaseFrom(params) {
  return request(`/api/Beauty/beauty/cpPurchaseFrom/getCpPurchaseFromList`, {
    method: 'POST',
    body: params,
  });
}

// 新增或修改
export async function addCpPurchaseFrom(params) {
  return request('/api/Beauty/beauty/cpPurchaseFrom/postCpPurchaseFrom', {
    method: 'POST',
    body: params,
  });
}

// 单个删除
export async function deleteCpPurchaseFrom(params) {
  return request('/api/Beauty/beauty/cpPurchaseFrom/deleteCpPurchaseFrom', {
    method: 'POST',
    body: params,
  });
}

// 获取详情
export async function getCpPurchaseFrom(params) {
  return request('/api/Beauty/beauty/cpPurchaseFrom/getCpPurchaseFrom', {
    method: 'POST',
    body: params,
  });
}

// 获取列详情
export async function getCpPurchaseFromLine(params) {
  return request('/api/Beauty/beauty/cpPurchaseFrom/getCpPurchaseFromLine', {
    method: 'POST',
    body: params,
  });
}


// 撤销
export async function cpPurchaseFromRevocation(params) {
  return request('/api/Beauty/beauty/cpPurchaseFrom/revocation', {
    method: 'POST',
    body: params,
  });
}

// 采购单明细

// 分页查询
export async function listCpPurchaseDetail(params) {
  return request(`/api/Beauty/beauty/cpPurchaseDetail/getCpPurchaseDetailList`, {
    method: 'POST',
    body: params,
  });
}

// 新增或修改
export async function addCpPurchaseDetail(params) {
  return request('/api/Beauty/beauty/cpPurchaseDetail/postCpPurchaseDetail', {
    method: 'POST',
    body: params,
  });
}

// 单个删除
export async function deleteCpPurchaseDetail(params) {
  return request('/api/Beauty/beauty/cpPurchaseDetail/deleteCpPurchaseDetail', {
    method: 'POST',
    body: params,
  });
}

// 获取详情
export async function getCpPurchaseDetail(params) {
  return request('/api/Beauty/beauty/cpPurchaseDetail/getCpPurchaseDetail', {
    method: 'POST',
    body: params,
  });
}

// 获取列详情
export async function getCpPurchaseDetailLine(params) {
  return request('/api/Beauty/beauty/cpPurchaseDetail/getCpPurchaseDetailLine', {
    method: 'POST',
    body: params,
  });
}

// 撤销
export async function cpPurchaseDetailRevocation(params) {
  return request('/api/Beauty/beauty/cpPurchaseDetail/revocation', {
    method: 'POST',
    body: params,
  });
}

// 待入库清单
// 分页查询
export async function postNBCpPurchaseStockPending(params) {
  return request(`/api/Beauty/beauty/cpPurchaseStockPending/postNBCpPurchaseStockPending`, {
    method: 'POST',
    body: params,
  });
}

export async function listCpPurchaseStockPending(params) {
  return request(`/api/Beauty/beauty/cpPurchaseStockPending/getCpPurchaseStockPendingList`, {
    method: 'POST',
    body: params,
  });
}

// 新增或修改
export async function addCpPurchaseStockPending(params) {
  return request('/api/Beauty/beauty/cpPurchaseStockPending/postCpPurchaseStockPending', {
    method: 'POST',
    body: params,
  });
}

// 单个删除
export async function deleteCpPurchaseStockPending(params) {
  return request('/api/Beauty/beauty/cpPurchaseStockPending/deleteCpPurchaseStockPending', {
    method: 'POST',
    body: params,
  });
}

// 获取详情
export async function getCpPurchaseStockPending(params) {
  return request('/api/Beauty/beauty/cpPurchaseStockPending/getCpPurchaseStockPending', {
    method: 'POST',
    body: params,
  });
}

// 获取列详情
export async function getCpPurchaseStockPendingLine(params) {
  return request('/api/Beauty/beauty/cpPurchaseStockPending/getCpPurchaseStockPendingLine', {
    method: 'POST',
    body: params,
  });
}


// 待销售清单过滤
export async function getStayMarketFromLine(params) {
  return request('/api/Beauty/beauty/stayMarketFrom/getStayMarketFromLine', {
    method: 'POST',
    body: params,
  });
}


// // 撤销
// export async function cpPurchaseStockPendingRevocation(params) {
//   return request('/api/Beauty/beauty/cpPurchaseStockPending/revocation',{
//      method: 'POST',
//      body: params,
//   });
// }

// 仓库
// 分页查询
export async function listCpEntrepot(params) {
  return request(`/api/Beauty/beauty/cpEntrepot/getCpEntrepotList`, {
    method: 'POST',
    body: params,
  });
}

// 新增或修改
export async function addCpEntrepot(params) {
  return request('/api/Beauty/beauty/cpEntrepot/postCpEntrepot', {
    method: 'POST',
    body: params,
  });
}

// 单个删除
export async function deleteCpEntrepot(params) {
  return request('/api/Beauty/beauty/cpEntrepot/deleteCpEntrepot', {
    method: 'POST',
    body: params,
  });
}

// 获取详情
export async function getCpEntrepot(params) {
  return request('/api/Beauty/beauty/cpEntrepot/getCpEntrepot', {
    method: 'POST',
    body: params,
  });
}

// 获取列详情
export async function getCpEntrepotLine(params) {
  return request('/api/Beauty/beauty/cpEntrepot/getCpEntrepotLine', {
    method: 'POST',
    body: params,
  });
}

// 库位
// 分页查询
export async function listCpStorage(params) {
  return request(`/api/Beauty/beauty/cpStorage/getCpStorageList`, {
    method: 'POST',
    body: params,
  });
}

// 新增或修改
export async function addCpStorage(params) {
  return request('/api/Beauty/beauty/cpStorage/postCpStorage', {
    method: 'POST',
    body: params,
  });
}

// 单个删除
export async function deleteCpStorage(params) {
  return request('/api/Beauty/beauty/cpStorage/deleteCpStorage', {
    method: 'POST',
    body: params,
  });
}

// 获取详情
export async function getCpStorage(params) {
  return request('/api/Beauty/beauty/cpStorage/getCpStorage', {
    method: 'POST',
    body: params,
  });
}

// 获取列详情
export async function getCpStorageLine(params) {
  return request('/api/Beauty/beauty/cpStorage/getCpStorageLine', {
    method: 'POST',
    body: params,
  });
}

// 配件仓库

// 分页查询
export async function listCpPjEntrepot(params) {
  return request(`/api/Beauty/beauty/cpPjEntrepot/getCpPjEntrepotList`, {
    method: 'POST',
    body: params,
  });
}

// 新增或修改
export async function addCpPjEntrepot(params) {
  return request('/api/Beauty/beauty/cpPjEntrepot/postCpPjEntrepot', {
    method: 'POST',
    body: params,
  });
}

// 单个删除
export async function deleteCpPjEntrepot(params) {
  return request('/api/Beauty/beauty/cpPjEntrepot/deleteCpPjEntrepot', {
    method: 'POST',
    body: params,
  });
}

// 获取详情
export async function getCpPjEntrepot(params) {
  return request('/api/Beauty/beauty/cpPjEntrepot/getCpPjEntrepot', {
    method: 'POST',
    body: params,
  });
}

// 获取列详情
export async function getCpPjEntrepotLine(params) {
  return request('/api/Beauty/beauty/cpPjEntrepot/getCpPjEntrepotLine', {
    method: 'POST',
    body: params,
  });
}

// 配件库位

// 分页查询
export async function listCpPjStorage(params) {
  return request(`/api/Beauty/beauty/cpPjStorage/getCpPjStorageList`, {
    method: 'POST',
    body: params,
  });
}

// 新增或修改
export async function addCpPjStorage(params) {
  return request('/api/Beauty/beauty/cpPjStorage/postCpPjStorage', {
    method: 'POST',
    body: params,
  });
}

// 单个删除
export async function deleteCpPjStorage(params) {
  return request('/api/Beauty/beauty/cpPjStorage/deleteCpPjStorage', {
    method: 'POST',
    body: params,
  });
}

// 获取详情
export async function getCpPjStorage(params) {
  return request('/api/Beauty/beauty/cpPjStorage/getCpPjStorage', {
    method: 'POST',
    body: params,
  });
}

// 获取列详情
export async function getCpPjStorageLine(params) {
  return request('/api/Beauty/beauty/cpPjStorage/getCpPjStorageLine', {
    method: 'POST',
    body: params,
  });
}

// 入库单

// 修改明细
export async function updateCpPurchaseDetail(params) {
  return request(`/api/Beauty/beauty/cpPurchaseDetail/updateCpPurchaseDetail`, {
    method: 'POST',
    body: params,
  });
}

// 分页查询
export async function cpInStorageFromupdate(params) {
  return request(`/api/Beauty/beauty/cpInStorageFrom/update`, {
    method: 'POST',
    body: params,
  });
}

// 分页查询
export async function listCpInStorageFrom(params) {
  return request(`/api/Beauty/beauty/cpInStorageFrom/getCpInStorageFromList`, {
    method: 'POST',
    body: params,
  });
}

// 新增或修改
export async function addCpInStorageFrom(params) {
  return request('/api/Beauty/beauty/cpInStorageFrom/postCpInStorageFrom', {
    method: 'POST',
    body: params,
  });
}

// 单个删除
export async function deleteCpInStorageFrom(params) {
  return request('/api/Beauty/beauty/cpInStorageFrom/deleteCpInStorageFrom', {
    method: 'POST',
    body: params,
  });
}

// 获取详情
export async function getCpInStorageFrom(params) {
  return request('/api/Beauty/beauty/cpInStorageFrom/getCpInStorageFrom', {
    method: 'POST',
    body: params,
  });
}

// 获取列详情
export async function getCpInStorageFromLine(params) {
  return request('/api/Beauty/beauty/cpInStorageFrom/getCpInStorageFromLine', {
    method: 'POST',
    body: params,
  });
}

// 撤销
export async function cpInStorageFromRevocation(params) {
  return request('/api/Beauty/beauty/cpInStorageFrom/revocation', {
    method: 'POST',
    body: params,
  });
}

// 添加物料明细
export async function createPurchaseDetail(params) {
  return request('/api/Beauty/beauty/cpPurchaseDetail/createPurchaseDetail', {
    method: 'POST',
    body: params,
  });
}

// 删除物料明细
export async function deleteCpInStorageDetail(params) {
  return request('/api/Beauty/beauty/cpPurchaseDetail/deleteStorage', {
    // return request('/api/Beauty/cpPurchaseDetail/deleteAccesssoriesSales',{
    method: 'POST',
    body: params,
  });
}

// 退货物料
export async function postCpOutSalesFrom(params) {
  return request('/api/Beauty/beauty/cpOutSalesFrom/postCpOutSalesFrom', {
    method: 'POST',
    body: params,
  });
}

// 退货单

// 修改退料明细
export async function cpOutSalesCreatePurchase(params) {
  return request(`/api/Beauty/beauty/cpPurchaseDetail/createPurchaseDetail`, {
    method: 'POST',
    body: params,
  });
}

//删除明细
export async function deleteCpOutSalesFromDetail(params) {
  return request(`/api/Beauty/beauty/cpPurchaseDetail/deleteCpOutSalesFromDetail`, {
    method: 'POST',
    body: params,
  });
}

export async function cpOutSalesFromupdate(params) {
  return request(`/api/Beauty/beauty/cpOutSalesFrom/update`, {
    method: 'POST',
    body: params,
  });
}

// 分页查询
export async function listCpOutSalesFrom(params) {
  return request(`/api/Beauty/beauty/cpOutSalesFrom/getCpOutSalesFromList`, {
    method: 'POST',
    body: params,
  });
}

// 新增或修改
export async function addCpOutSalesFrom(params) {
  // return request('/api/Beauty/beauty/cpOutSalesFrom/postCpOutSalesFrom', {
  return request('/api/Beauty/beauty/cpOutSalesFrom/updateCpOutSalesFrom', {
    method: 'POST',
    body: params,
  });
}

// 单个删除
export async function deleteCpOutSalesFrom(params) {
  return request('/api/Beauty/beauty/cpOutSalesFrom/deleteCpOutSalesFrom', {
    method: 'POST',
    body: params,
  });
}

// 获取详情
export async function getCpOutSalesFrom(params) {
  return request('/api/Beauty/beauty/cpOutSalesFrom/getCpOutSalesFrom', {
    method: 'POST',
    body: params,
  });
}

// 获取列详情
export async function getCpOutSalesFromLine(params) {
  return request('/api/Beauty/beauty/cpOutSalesFrom/getCpOutSalesFromLine', {
    method: 'POST',
    body: params,
  });
}

// 撤销
export async function cpOutSalesFromRevocation(params) {
  return request('/api/Beauty/beauty/cpOutSalesFrom/revocation', {
    method: 'POST',
    body: params,
  });
}

// 出库单

// 生成退料单
export async function createQuitForm(params) {
  return request('/api/Beauty/beauty/cpOutStorageFrom/createQuitForm', {
    method: 'POST',
    body: params,
  });
}

// 修改物料明细
export async function updateOutFromDetail(params) {
  return request('/api/Beauty/beauty/cpPurchaseDetail/updateOutFromDetail', {
    method: 'POST',
    body: params,
  });
}

// 删除物料明细
export async function cpOutStorageDeleteStorage(params) {
  return request('/api/Beauty/beauty/cpPurchaseDetail/deleteStorage', {
    method: 'POST',
    body: params,
  });
}

export async function cpOutStorageFromupdate(params) {
  return request(`/api/Beauty/beauty/cpOutStorageFrom/update`, {
    method: 'POST',
    body: params,
  });
}

// 分页查询
export async function listCpOutStorageFrom(params) {
  return request(`/api/Beauty/beauty/cpOutStorageFrom/getCpOutStorageFromList`, {
    method: 'POST',
    body: params,
  });
}

// 新增或修改
export async function addCpOutStorageFrom(params) {
  return request('/api/Beauty/beauty/cpOutStorageFrom/postCpOutStorageFrom', {
    method: 'POST',
    body: params,
  });
}

// 单个删除
export async function deleteCpOutStorageFrom(params) {
  return request('/api/Beauty/beauty/cpOutStorageFrom/deleteCpOutStorageFrom', {
    method: 'POST',
    body: params,
  });
}

// 获取详情
export async function getCpOutStorageFrom(params) {
  return request('/api/Beauty/beauty/cpOutStorageFrom/getCpOutStorageFrom', {
    method: 'POST',
    body: params,
  });
}

// 获取列详情
export async function getCpOutStorageFromLine(params) {
  return request('/api/Beauty/beauty/cpOutStorageFrom/getCpOutStorageFromLine', {
    method: 'POST',
    body: params,
  });
}

// 撤销
export async function cpOutStorageFromRevocation(params) {
  return request('/api/Beauty/beauty/cpOutStorageFrom/revocation', {
    method: 'POST',
    body: params,
  });
}

// 退料单

// 删除退料明细
export async function deleteQuitFromDetail(params) {
  return request(`/api/Beauty/beauty/cpPurchaseDetail/deleteQuitFromDetail`, {
    method: 'POST',
    body: params,
  });
}

// 修改退料明细
export async function updateQuitFromDetail(params) {
  return request(`/api/Beauty/beauty/cpPurchaseDetail/updateQuitFromDetail`, {
    method: 'POST',
    body: params,
  });
}

// 分页查询
export async function cpQuitFromupdate(params) {
  return request(`/api/Beauty/beauty/cpQuitFrom/update`, {
    method: 'POST',
    body: params,
  });
}

// 分页查询
export async function listCpQuitFrom(params) {
  return request(`/api/Beauty/beauty/cpQuitFrom/getCpQuitFromList`, {
    method: 'POST',
    body: params,
  });
}

// 新增或修改
export async function addCpQuitFrom(params) {
  return request('/api/Beauty/beauty/cpQuitFrom/postCpQuitFrom', {
    method: 'POST',
    body: params,
  });
}

// 单个删除
export async function deleteCpQuitFrom(params) {
  return request('/api/Beauty/beauty/cpQuitFrom/deleteCpQuitFrom', {
    method: 'POST',
    body: params,
  });
}

// 获取详情
export async function getCpQuitFrom(params) {
  return request('/api/Beauty/beauty/cpQuitFrom/getCpQuitFrom', {
    method: 'POST',
    body: params,
  });
}

// 获取列详情
export async function getCpQuitFromLine(params) {
  return request('/api/Beauty/beauty/cpQuitFrom/getCpQuitFromLine', {
    method: 'POST',
    body: params,
  });
}

// 撤销
export async function cpQuitFromRevocation(params) {
  return request('/api/Beauty/beauty/cpQuitFrom/revocation', {
    method: 'POST',
    body: params,
  });
}

// 总成采购单

// 新增明细
export async function postZcCpPurchaseDetail(params) {
  return request(`/api/Beauty/beauty/cpPurchaseDetail/postZcCpPurchaseDetail`, {
    method: 'POST',
    body: params,
  });
}

// 删除明细
export async function deleteZcCpPurchaseDetail(params) {
  return request(`/api/Beauty/beauty/cpPurchaseDetail/deleteZcCpPurchaseDetail`, {
    method: 'POST',
    body: params,
  });
}

// 分页查询
export async function cpZcPurchaseFromupdate(params) {
  return request(`/api/Beauty/beauty/cpZcPurchaseFrom/update`, {
    method: 'POST',
    body: params,
  });
}

// 分页查询
export async function listCpZcPurchaseFrom(params) {
  return request(`/api/Beauty/beauty/cpZcPurchaseFrom/getCpZcPurchaseFromList`, {
    method: 'POST',
    body: params,
  });
}

// 撤销
export async function cpZcPurchaseFromRevocation(params) {
  return request('/api/Beauty/beauty/cpZcPurchaseFrom/revocation', {
    method: 'POST',
    body: params,
  });
}

// 新增或修改
export async function addCpZcPurchaseFrom(params) {
  return request('/api/Beauty/beauty/cpZcPurchaseFrom/postCpZcPurchaseFrom', {
    method: 'POST',
    body: params,
  });
}

// 单个删除
export async function deleteCpZcPurchaseFrom(params) {
  return request('/api/Beauty/beauty/cpZcPurchaseFrom/deleteCpZcPurchaseFrom', {
    method: 'POST',
    body: params,
  });
}

// 获取详情
export async function getCpZcPurchaseFrom(params) {
  return request('/api/Beauty/beauty/cpZcPurchaseFrom/getCpZcPurchaseFrom', {
    method: 'POST',
    body: params,
  });
}

// 获取列详情
export async function getCpZcPurchaseFromLine(params) {
  return request('/api/Beauty/beauty/cpZcPurchaseFrom/getCpZcPurchaseFromLine', {
    method: 'POST',
    body: params,
  });
}

// 总成入库单

// 生成退货单
export async function salesCpProduct(params) {
  return request(`/api/Beauty/beauty/cpProduct/salesCpProduct`, {
    method: 'POST',
    body: params,
  });
}

export async function cpProductupdate(params) {
  return request(`/api/Beauty/beauty/cpProduct/update`, {
    method: 'POST',
    body: params,
  });
}

// 分页查询
export async function listCpProduct(params) {
  return request(`/api/Beauty/beauty/cpProduct/getCpProductList`, {
    method: 'POST',
    body: params,
  });
}

// 新增或修改
export async function addCpProduct(params) {
  return request('/api/Beauty/beauty/cpProduct/postCpProduct', {
    method: 'POST',
    body: params,
  });
}

// 单个删除
export async function deleteCpProduct(params) {
  return request('/api/Beauty/beauty/cpProduct/deleteCpProduct', {
    method: 'POST',
    body: params,
  });
}

// 获取详情
export async function getCpProduct(params) {
  return request('/api/Beauty/beauty/cpProduct/getCpProduct', {
    method: 'POST',
    body: params,
  });
}

// 获取列详情
export async function getCpProductLine(params) {
  return request('/api/Beauty/beauty/cpProduct/getCpProductLine', {
    method: 'POST',
    body: params,
  });
}

// 撤销
export async function cpProductRevocation(params) {
  return request('/api/Beauty/beauty/cpProduct/revocation', {
    method: 'POST',
    body: params,
  });
}

// 总成退货单

// 分页查询
export async function cpProductSalesFromupdate(params) {
  return request(`/api/Beauty/beauty/cpProductSalesFrom/update`, {
    method: 'POST',
    body: params,
  });
}

// 分页查询
export async function listCpProductSalesFrom(params) {
  return request(`/api/Beauty/beauty/cpProductSalesFrom/getCpProductSalesFromList`, {
    method: 'POST',
    body: params,
  });
}

// 新增或修改
export async function addCpProductSalesFrom(params) {
  return request('/api/Beauty/beauty/cpProductSalesFrom/postCpProductSalesFrom', {
    method: 'POST',
    body: params,
  });
}

// 单个删除
export async function deleteCpProductSalesFrom(params) {
  return request('/api/Beauty/beauty/cpProductSalesFrom/deleteCpProductSalesFrom', {
    method: 'POST',
    body: params,
  });
}

// 获取详情
export async function getCpProductSalesFrom(params) {
  return request('/api/Beauty/beauty/cpProductSalesFrom/getCpProductSalesFrom', {
    method: 'POST',
    body: params,
  });
}

// 获取列详情
export async function getCpProductSalesFromLine(params) {
  return request('/api/Beauty/beauty/cpProductSalesFrom/getCpProductSalesFromLine', {
    method: 'POST',
    body: params,
  });
}

// 撤销
export async function cpProductSalesFromRevocation(params) {
  return request('/api/Beauty/beauty/cpProductSalesFrom/revocation', {
    method: 'POST',
    body: params,
  });
}

// 总成出库单

//选择总成
export async function zcProuctStatistics(params) {
  return request(`/api/Beauty/beauty/cpPurchaseDetail/zcProuctStatistics`, {
    method: 'POST',
    body: params,
  });
}

// 退料

// 生成退货单
export async function outMaterial(params) {
  return request(`/api/Beauty/beauty/cpOutProduct/outMaterial`, {
    method: 'POST',
    body: params,
  });
}

// 分页查询
export async function cpOutProductupdate(params) {
  return request(`/api/Beauty/beauty/cpOutProduct/update`, {
    method: 'POST',
    body: params,
  });
}

// 分页查询
export async function listCpOutProduct(params) {
  return request(`/api/Beauty/beauty/cpOutProduct/getCpOutProductList`, {
    method: 'POST',
    body: params,
  });
}

// 新增或修改
export async function addCpOutProduct(params) {
  return request('/api/Beauty/beauty/cpOutProduct/postCpOutProduct', {
    method: 'POST',
    body: params,
  });
}

// 单个删除
export async function deleteCpOutProduct(params) {
  return request('/api/Beauty/beauty/cpOutProduct/deleteCpOutProduct', {
    method: 'POST',
    body: params,
  });
}

// 获取详情
export async function getCpOutProduct(params) {
  return request('/api/Beauty/beauty/cpOutProduct/getCpOutProduct', {
    method: 'POST',
    body: params,
  });
}

// 获取列详情
export async function getCpOutProductLine(params) {
  return request('/api/Beauty/beauty/cpOutProduct/getCpOutProductLine', {
    method: 'POST',
    body: params,
  });
}

// 撤销
export async function cpOutProductRevocation(params) {
  return request('/api/Beauty/beauty/cpOutProduct/revocation', {
    method: 'POST',
    body: params,
  });
}

// 总成退料单
// 分页查询
export async function listCpProductQuitFrom(params) {
  return request(`/api/Beauty/beauty/cpProductQuitFrom/getCpProductQuitFromList`, {
    method: 'POST',
    body: params,
  });
}

// 新增或修改
export async function cpProductQuitFromupdate(params) {
  return request('/api/Beauty/beauty/cpProductQuitFrom/update', {
    method: 'POST',
    body: params,
  });
}

// 新增或修改
export async function addCpProductQuitFrom(params) {
  return request('/api/Beauty/beauty/cpProductQuitFrom/postCpProductQuitFrom', {
    method: 'POST',
    body: params,
  });
}

// 单个删除
export async function deleteCpProductQuitFrom(params) {
  return request('/api/Beauty/beauty/cpProductQuitFrom/deleteCpProductQuitFrom', {
    method: 'POST',
    body: params,
  });
}

// 获取详情
export async function getCpProductQuitFrom(params) {
  return request('/api/Beauty/beauty/cpProductQuitFrom/getCpProductQuitFrom', {
    method: 'POST',
    body: params,
  });
}

// 获取列详情
export async function getCpProductQuitFromLine(params) {
  return request('/api/Beauty/beauty/cpProductQuitFrom/getCpProductQuitFromLine', {
    method: 'POST',
    body: params,
  });
}

// 撤销
export async function cpProductQuitFromRevocation(params) {
  return request('/api/Beauty/beauty/cpProductQuitFrom/revocation', {
    method: 'POST',
    body: params,
  });
}

// 成本单

// 分页查询
export async function cpCostFormupdate(params) {
  return request(`/api/Beauty/beauty/cpCostForm/update`, {
    method: 'POST',
    body: params,
  });
}
// 分页查询
export async function listCpCostForm(params) {
  return request(`/api/Beauty/beauty/cpCostForm/getCpCostFormList`, {
    method: 'POST',
    body: params,
  });
}

// 新增或修改
export async function addCpCostForm(params) {
  return request('/api/Beauty/beauty/cpCostForm/postCpCostForm', {
    method: 'POST',
    body: params,
  });
}

// 单个删除
export async function deleteCpCostForm(params) {
  return request('/api/Beauty/beauty/cpCostForm/deleteCpCostForm', {
    method: 'POST',
    body: params,
  });
}

// 获取详情
export async function getCpCostForm(params) {
  return request('/api/Beauty/beauty/cpCostForm/getCpCostForm', {
    method: 'POST',
    body: params,
  });
}

//获取列详情
export async function getCpCostFormLine(params) {
  return request('/api/Beauty/beauty/cpCostForm/getCpCostFormLine', {
    method: 'POST',
    body: params,
  });
}

// 撤销
export async function cpCostFormRevocation(params) {
  return request('/api/Beauty/beauty/cpCostForm/revocation', {
    method: 'POST',
    body: params,
  });
}

// 总产值报表

export async function getTotalStatementLine(params) {
  return request('/api/Beauty/beauty/statisticsReport/getTotalStatementLine', {
    method: 'POST',
    body: params,
  });
}

export async function findTotalOutPutValue(params) {
  return request('/api/Beauty/beauty/statisticsReport/findTotalOutPutValue', {
    method: 'POST',
    body: params,
  });
}

// 总产值/外部/内部饼图
export async function getTotalValueFigureDrawing(params) {
  return request('/api/Beauty/beauty/statisticsReport/getTotalValueFigureDrawing', {
    method: 'POST',
    body: params,
  });
}

// // 总产值列表
// export async function findTotalOutPutValue(params) {
//   return request('/api/Beauty/beauty/statisticsReport/findValue',{
//      method: 'POST',
//      body: params,
//   });
// }

// 总产值/外部产值/内部产值曲线图
export async function getCapacityNumberAndMoney(params) {
  return request('/api/Beauty/beauty/statisticsReport/getCapacityNumberAndMoney', {
    method: 'POST',
    body: params,
  });
}

// 外部产值报表
export async function findExternalTotalOutPutValue(params) {
  return request('/api/Beauty/beauty/statisticsReport/findExternalTotalOutPutValue', {
    method: 'POST',
    body: params,
  });
}

//内部产值报表
export async function findInternalTotalOutPutValue(params) {
  return request('/api/Beauty/beauty/statisticsReport/findInternalTotalOutPutValue', {
    method: 'POST',
    body: params,
  });
}

// 配件进销存1
export async function findAccessoriesInStock(params) {
  return request('/api/Beauty/beauty/statisticsReport/findAccessoriesInStock', {
    method: 'POST',
    body: params,
  });
}

// 总成进销存1
export async function findAssemblyInStock(params) {
  return request('/api/Beauty/beauty/statisticsReport/findAssemblyInStock', {
    method: 'POST',
    body: params,
  });
}
// 配件进销存2
export async function findAccessoriesTwoInStock(params) {
  return request('/api/Beauty/beauty/statisticsReport/findAccessoriesTwoInStock', {
    method: 'POST',
    body: params,
  });
}

// 总成进销存2
export async function findAssemblyTwoInStock(params) {
  return request('/api/Beauty/beauty/statisticsReport/findAssemblyTwoInStock', {
    method: 'POST',
    body: params,
  });
}

//成本单报表1
export async function findCostSummary(params) {
  return request('/api/Beauty/beauty/statisticsReport/findCostSummary', {
    method: 'POST',
    body: params,
  });
}

//成本单报表2
export async function findTwoCostSummary(params) {
  return request('/api/Beauty/beauty/statisticsReport/findTwoCostSummary', {
    method: 'POST',
    body: params,
  });
}

//毛利报表
export async function findGrossProfitMargin(params) {
  return request('/api/Beauty/beauty/statisticsReport/findGrossProfitMargin', {
    method: 'POST',
    body: params,
  });
}

//月统计汇总
export async function getCountBusinessOrderNumber(params) {
  return request('/api/Beauty/beauty/statisticsReport/getCountBusinessOrderNumber', {
    method: 'POST',
    body: params,
  });
}

//日统计汇总
export async function getCountBusinessOrderNumberDay(params) {
  return request('/api/Beauty/beauty/statisticsReport/getCountBusinessOrderNumberDay', {
    method: 'POST',
    body: params,
  });
}

// 进度表
export async function findStatisticsReportProgress(params) {
  return request('/api/Beauty/beauty/statisticsReport/findStatisticsReportProgress', {
    method: 'POST',
    body: params,
  });
}

// 配件入库
export async function findInStorageDetail(params) {
  return request('/api/Beauty/beauty/statisticsReport/findInStorageDetail', {
    method: 'POST',
    body: params,
  });
}

// 配件退货
export async function findOutSalesFromDetail(params) {
  return request('/api/Beauty/beauty/statisticsReport/findOutSalesFromDetail', {
    method: 'POST',
    body: params,
  });
}

// 配件出库
export async function findOutStorageDetail(params) {
  return request('/api/Beauty/beauty/statisticsReport/findOutStorageDetail', {
    method: 'POST',
    body: params,
  });
}

// 配件退料
export async function findQuitFromDetail(params) {
  return request('/api/Beauty/beauty/statisticsReport/findQuitFromDetail', {
    method: 'POST',
    body: params,
  });
}

// 总成入库
export async function findZCInStorageDetail(params) {
  return request('/api/Beauty/beauty/statisticsReport/findZCInStorageDetail', {
    method: 'POST',
    body: params,
  });
}

// 总成退货
export async function findZCOutSalesFromDetail(params) {
  return request('/api/Beauty/beauty/statisticsReport/findZCOutSalesFromDetail', {
    method: 'POST',
    body: params,
  });
}

// 总成出库
export async function findZCOutStorageDetail(params) {
  return request('/api/Beauty/beauty/statisticsReport/findZCOutStorageDetail', {
    method: 'POST',
    body: params,
  });
}

// 总成退料
export async function findZCQuitFromDetail(params) {
  return request('/api/Beauty/beauty/statisticsReport/findZCQuitFromDetail', {
    method: 'POST',
    body: params,
  });
}

// 车间现场库表
export async function pjplant(params) {
  return request('/api/Beauty/beauty/cpPurchaseDetail/pjplant', {
    method: 'POST',
    body: params,
  });
}
export async function zcplant(params) {
  return request('/api/Beauty/beauty/cpPurchaseDetail/zcplant', {
    method: 'POST',
    body: params,
  });
}

// 车间现场库

export async function cjstatistics(params) {
  return request('/api/Beauty/beauty/cpPurchaseDetail/cjstatistics', {
    method: 'POST',
    body: params,
  });
}

// 分页查询
export async function cpPlantSceneFromupdate(params) {
  return request(`/api/Beauty/beauty/cpPlantSceneFrom/update`, {
    method: 'POST',
    body: params,
  });
}

// 分页查询
export async function listCpPlantSceneFrom(params) {
  return request(`/api/Beauty/beauty/cpPlantSceneFrom/getCpPlantSceneFromList`, {
    method: 'POST',
    body: params,
  });
}

// 新增或修改
export async function addCpPlantSceneFrom(params) {
  return request('/api/Beauty/beauty/cpPlantSceneFrom/postCpPlantSceneFrom', {
    method: 'POST',
    body: params,
  });
}

// 单个删除
export async function deleteCpPlantSceneFrom(params) {
  return request('/api/Beauty/beauty/cpPlantSceneFrom/deleteCpPlantSceneFrom', {
    method: 'POST',
    body: params,
  });
}

// 获取详情
export async function getCpPlantSceneFrom(params) {
  return request('/api/Beauty/beauty/cpPlantSceneFrom/getCpPlantSceneFrom', {
    method: 'POST',
    body: params,
  });
}

// 获取列详情
export async function getCpPlantSceneFromLine(params) {
  return request('/api/Beauty/beauty/cpPlantSceneFrom/getCpPlantSceneFromLine', {
    method: 'POST',
    body: params,
  });
}

// 撤销
export async function cpPlantSceneFromRevocation(params) {
  return request('/api/Beauty/beauty/cpPlantSceneFrom/revocation', {
    method: 'POST',
    body: params,
  });
}

// 售后结案单

export async function cpAfterJaFromupdate(params) {
  return request(`/api/Beauty/beauty/cpAfterJaFrom/update`, {
    method: 'POST',
    body: params,
  });
}

// 撤销
export async function cpAfterJaFromrevocation(params) {
  return request(`/api/Beauty/beauty/cpAfterJaFrom/revocation`, {
    method: 'POST',
    body: params,
  });
}

// 分页查询
export async function listCpAfterJaFrom(params) {
  return request(`/api/Beauty/beauty/cpAfterJaFrom/getCpAfterJaFromList`, {
    method: 'POST',
    body: params,
  });
}

// 新增或修改
export async function addCpAfterJaFrom(params) {
  return request('/api/Beauty/beauty/cpAfterJaFrom/postCpAfterJaFrom', {
    method: 'POST',
    body: params,
  });
}

// 单个删除
export async function deleteCpAfterJaFrom(params) {
  return request('/api/Beauty/beauty/cpAfterJaFrom/deleteCpAfterJaFrom', {
    method: 'POST',
    body: params,
  });
}

// 获取详情
export async function getCpAfterJaFrom(params) {
  return request('/api/Beauty/beauty/cpAfterJaFrom/getCpAfterJaFrom', {
    method: 'POST',
    body: params,
  });
}

// 获取列详情
export async function getCpAfterJaFromLine(params) {
  return request('/api/Beauty/beauty/cpAfterJaFrom/getCpAfterJaFromLine', {
    method: 'POST',
    body: params,
  });
}

// 税票申请单

//已开票记录提交
export async function updateCpStartInvoice(params) {
  return request(`/api/Beauty/beauty/cpStartInvoice/updateCpStartInvoice`, {
    method: 'POST',
    body: params,
  });
}

export async function getCpStartInvoiceListCpcliect(params) {
  return request(`/api/Beauty/beauty/cpStartInvoice/getCpStartInvoiceListCpcliect`, {
    method: 'POST',
    body: params,
  });
}

// 弹窗历史开票明细
export async function getCpInvoiceDetailListNoPage(params) {
  return request(`/api/Beauty/beauty/cpInvoiceDetail/getCpInvoiceDetailListNoPage`, {
    method: 'POST',
    body: params,
  });
}

// 分页查询
export async function listCpStartInvoice(params) {
  return request(`/api/Beauty/beauty/cpStartInvoice/getCpStartInvoiceList`, {
    method: 'POST',
    body: params,
  });
}

// 新增或修改
export async function addCpStartInvoice(params) {
  return request('/api/Beauty/beauty/cpStartInvoice/save', {
    method: 'POST',
    body: params,
  });
}

// 单个删除
export async function deleteCpStartInvoice(params) {
  return request('/api/Beauty/beauty/cpStartInvoice/deleteCpStartInvoice', {
    method: 'POST',
    body: params,
  });
}

// 获取详情
export async function getCpStartInvoice(params) {
  return request('/api/Beauty/beauty/cpStartInvoice/getCpStartInvoice', {
    method: 'POST',
    body: params,
  });
}

// 获取列详情
export async function getCpStartInvoiceLine(params) {
  return request('/api/Beauty/beauty/cpStartInvoice/getCpStartInvoiceLine', {
    method: 'POST',
    body: params,
  });
}

// 关闭订单

// 分页查询
export async function listCpClose(params) {
  return request(`/api/Beauty/beauty/cpClose/getCpCloseList`, {
    method: 'POST',
    body: params,
  });
}

// 新增或修改
export async function addCpClose(params) {
  return request('/api/Beauty/beauty/cpClose/postCpClose', {
    method: 'POST',
    body: params,
  });
}

// 单个删除
export async function deleteCpClose(params) {
  return request('/api/Beauty/beauty/cpClose/deleteCpClose', {
    method: 'POST',
    body: params,
  });
}

// 获取详情
export async function getCpClose(params) {
  return request('/api/Beauty/beauty/cpClose/getCpClose', {
    method: 'POST',
    body: params,
  });
}

// 获取列详情
export async function getCpCloseLine(params) {
  return request('/api/Beauty/beauty/cpClose/getCpCloseLine', {
    method: 'POST',
    body: params,
  });
}

// 配件库存总表

export async function getStatisticsDetailLine(params) {
  return request('/api/Beauty/beauty/cpPurchaseDetail/getStatisticsDetailLine', {
    method: 'POST',
    body: params,
  });
}

export async function pjstatistics(params) {
  return request('/api/Beauty/beauty/cpPurchaseDetail/statistics', {
    method: 'POST',
    body: params,
  });
}
export async function getByBill(params) {
  return request('/api/Beauty/beauty/cpPurchaseDetail/getByBill', {
    method: 'POST',
    body: params,
  });
}
// 总成车间总表

export async function zcCJStatistics(params) {
  return request('/api/Beauty/beauty/cpPurchaseDetail/zcCJStatistics', {
    method: 'POST',
    body: params,
  });
}

// 总成库存总表

export async function zcstatistics(params) {
  return request('/api/Beauty/beauty/cpPurchaseDetail/zcStatistics', {
    method: 'POST',
    body: params,
  });
}

export async function getzcByBill(params) {
  return request('/api/Beauty/beauty/cpPurchaseDetail/getzcByBill', {
    method: 'POST',
    body: params,
  });
}

// 分页查询
export async function listCpQualityCard(params) {
  return request(`/api/Beauty/beauty/cpQualityCard/getCpQualityCardList`, {
    method: 'POST',
    body: params,
  });
}

// 质保卡
// 新增或修改
export async function addCpQualityCard(params) {
  return request('/api/Beauty/beauty/cpQualityCard/postCpQualityCard', {
    method: 'POST',
    body: params,
  });
}

// 单个删除
export async function deleteCpQualityCard(params) {
  return request('/api/Beauty/beauty/cpQualityCard/deleteCpQualityCard', {
    method: 'POST',
    body: params,
  });
}

// 获取详情
export async function getCpQualityCard(params) {
  return request('/api/Beauty/beauty/cpQualityCard/getCpQualityCard', {
    method: 'POST',
    body: params,
  });
}

// 获取列详情
export async function getCpQualityCardLine(params) {
  return request('/api/Beauty/beauty/cpQualityCard/getCpQualityCardLine', {
    method: 'POST',
    body: params,
  });
}

// 弹出框 用户

export async function modeluserList(params) {
  return request('/api/Beauty/sys/user/userList', {
    method: 'POST',
    body: params,
  });
}

// 根据物料仓库查询最后一次库位
export async function lastCpPurchaseDetail(params) {
  return request('/api/Beauty/beauty/cpPurchaseDetail/lastCpPurchaseDetail', {
    method: 'POST',
    body: params,
  });
}

// 根据物料仓库查询库位
export async function selectDetail(params) {
  return request('/api/Beauty/beauty/cpPurchaseDetail/selectDetail', {
    method: 'POST',
    body: params,
  });
}

// 税票申请单

//待开票列表
export async function getIssueCpStartInvoiceList(params) {
  return request(`/api/Beauty/beauty/cpStartInvoice/getIssueCpStartInvoiceList`, {
    method: 'POST',
    body: params,
  });
}
//已开票列表
export async function getalreadyCpStartInvoiceList(params) {
  return request(`/api/Beauty/beauty/cpStartInvoice/getalreadyCpStartInvoiceList`, {
    method: 'POST',
    body: params,
  });
}
//退票列表
export async function getexitCpStartInvoiceList(params) {
  return request(`/api/Beauty/beauty/cpStartInvoice/getexitCpStartInvoiceList`, {
    method: 'POST',
    body: params,
  });
}

//待开票提交
export async function cpStartInvoicecompletion(params) {
  return request(`/api/Beauty/beauty/cpStartInvoice/completion`, {
    method: 'POST',
    body: params,
  });
}
// 退票
export async function cpStartInvoiceticket(params) {
  return request(`/api/Beauty/beauty/cpStartInvoice/ticket`, {
    method: 'POST',
    body: params,
  });
}

// 查询变更金额
export async function selectOfffrom(params) {
  return request(`/api/Beauty/beauty/cpStartInvoice/selectOfffrom`, {
    method: 'POST',
    body: params,
  });
}

//分页查询
export async function listCpInvoiceDetail(params) {
  return request(`/api/Beauty/beauty/cpInvoiceDetail/getCpInvoiceDetailList`, {
    method: 'POST',
    body: params,
  });
}

// 撤销
export async function cpInvoiceDetailrevocation(params) {
  return request(`/api/Beauty/beauty/cpStartInvoice/revocation`, {
    method: 'POST',
    body: params,
  });
}

// 重新提交
export async function cpInvoiceDetailresubmit(params) {
  return request('/api/Beauty/beauty/cpStartInvoice/resubmit', {
    method: 'POST',
    body: params,
  });
}

//新增或修改
export async function addCpInvoiceDetail(params) {
  return request('/api/Beauty/beauty/cpInvoiceDetail/postCpInvoiceDetail', {
    method: 'POST',
    body: params,
  });
}

// 审核
export async function cpInvoiceDetailisPass(params) {
  return request('/api/Beauty/beauty/cpStartInvoice/isPass', {
    method: 'POST',
    body: params,
  });
}

//提交
export async function postCpStartInvoice(params) {
  return request('/api/Beauty/beauty/cpStartInvoice/postCpStartInvoice', {
    method: 'POST',
    body: params,
  });
}

export async function postCFDetail(params) {
  return request('/api/Beauty/beauty/cpInvoiceDetail/postCFDetail', {
    method: 'POST',
    body: params,
  });
}

//单个删除
export async function deleteCpInvoiceDetail(params) {
  return request('/api/Beauty/beauty/cpInvoiceDetail/deleteCpInvoiceDetail', {
    method: 'POST',
    body: params,
  });
}

// 必须件

// 批量新增
export async function updateMustParent(params) {
  return request('/api/Beauty/beauty/cpBillMaterial/updateMustParent', {
    method: 'POST',
    body: params,
  });
}

// 未被添加物料
// export async function getCpBillMaterialListNo(params) {
//   return request('/api/Beauty/beauty/cpBillMaterial/getCpBillMaterialListNo', {
//      method: 'POST',
//      body: params,
//   });
// }

export async function postMustCpType(params) {
  return request('/api/Beauty/beauty/cpType/postMustCpType', {
    method: 'POST',
    body: params,
  });
}

export async function getMustCpTypeList(params) {
  return request('/api/Beauty/beauty/cpType/getMustCpTypeList', {
    method: 'POST',
    body: params,
  });
}

//资料查询
export async function postCpType(params) {
  return request('/api/Beauty/beauty/cpType/postCpType', {
    method: 'POST',
    body: params,
  });
}
export async function getCpTypeList(params) {
  return request('/api/Beauty/beauty/cpType/getCpTypeList', {
    method: 'POST',
    body: params,
  });
}
export async function getCpType(params) {
  return request('/api/Beauty/beauty/cpType/getCpType', {
    method: 'POST',
    body: params,
  });
}

export async function deleteCpType(params) {
  return request('/api/Beauty/beauty/cpType/deleteCpType', {
    method: 'POST',
    body: params,
  });
}

//配件销售价格表
//列表
export async function getCpSalesAccessoriesMoneyList(params) {
  return request('/api/Beauty/beauty/cpSalesAccessoriesMoney/getCpSalesAccessoriesMoneyList', {
    method: 'POST',
    body: params,
  });
}

//详情
export async function getCpSalesAccessoriesMoney(params) {
  return request('/api/Beauty/beauty/cpSalesAccessoriesMoney/getCpSalesAccessoriesMoney', {
    method: 'POST',
    body: params,
  });
}

//删除
export async function CpSalesAccessoriesMoneyDelete(params) {
  return request('/api/Beauty/beauty/cpSalesAccessoriesMoney/delete', {
    method: 'POST',
    body: params,
  });
}

//删除
export async function CpSalesAccessoriesMoneySave(params) {
  return request('/api/Beauty/beauty/cpSalesAccessoriesMoney/save', {
    method: 'POST',
    body: params,
  });
}

//提交
export async function postCpSalesAccessoriesMoney(params) {
  return request('/api/Beauty/beauty/cpSalesAccessoriesMoney/postCpSalesAccessoriesMoney', {
    method: 'POST',
    body: params,
  });
}

//质保清单

// 撤销
export async function cpBatchesCardRevocation(params) {
  return request('/api/Beauty/beauty/cpBatchesCard/revocation', {
    method: 'POST',
    body: params,
  });
}

//明细列表
export async function getCpBatchesCardDetailList(params) {
  return request(`/api/Beauty/beauty/cpBatchesCard/getCpBatchesCardDetailList`, {
    method: 'POST',
    body: params,
  });
}

//新增明细
export async function postCpBatchesCardDetail(params) {
  return request(`/api/Beauty/beauty/cpBatchesCard/postCpBatchesCardDetail`, {
    method: 'POST',
    body: params,
  });
}

//新增或修改
export async function deleteCpBatchesCardDetail(params) {
  return request('/api/Beauty/beauty/cpBatchesCard/deleteCpBatchesCardDetail', {
    method: 'POST',
    body: params,
  });
}

//分页查询
export async function listCpBatchesCard(params) {
  return request(`/api/Beauty/beauty/cpBatchesCard/getCpBatchesCardList`, {
    method: 'POST',
    body: params,
  });
}

//新增或修改
export async function addCpBatchesCard(params) {
  return request('/api/Beauty/beauty/cpBatchesCard/postCpBatchesCard', {
    method: 'POST',
    body: params,
  });
}

//单个删除
export async function deleteCpBatchesCard(params) {
  return request('/api/Beauty/beauty/cpBatchesCard/deleteCpBatchesCard', {
    method: 'POST',
    body: params,
  });
}

//获取详情
export async function getCpBatchesCard(params) {
  return request('/api/Beauty/beauty/cpBatchesCard/getCpBatchesCard', {
    method: 'POST',
    body: params,
  });
}

//获取列详情
export async function getCpBatchesCardLine(params) {
  return request('/api/Beauty/beauty/cpBatchesCard/getCpBatchesCardLine', {
    method: 'POST',
    body: params,
  });
}

// 采购单二维码
export async function getQrCpPurchaseStockPendingList(params) {
  return request('/api/Beauty/beauty/cpPurchaseStockPending/getQrCpPurchaseStockPendingList', {
    method: 'POST',
    body: params,
  });
}

// 生成二维码

// export async function getFlatCode(params) {
//    return request(`/api/Beauty/dormitory/flatCode/getFlatCode`,{
//     method: 'GET',
//     body: params,
//    })
//   }

export async function getFlatCode(params) {
  return request(`/api/Beauty/dormitory/flatCode/getFlatCode?${stringify(params)}`);
}

export async function getFlatOrderdCode(params) {
  return request(`/api/Beauty/dormitory/flatCode/getFlatOrderdCode?${stringify(params)}`);
}

// export async function getFlatOrderdCode(params) {
//   return request(`/api/Beauty/dormitory/flatCode/getFlatOrderdCode?${stringify(params)}`,{
//   method: 'GET',
//   body: params,
//  })
// }

// 盘点单

// 列表删除
export async function deleteCpInventory(params) {
  return request('/api/Beauty/beauty/cpInventory/deleteCpInventory', {
    method: 'POST',
    body: params,
  });
}

// 删除
export async function deleteCpInventoryOperationItem(params) {
  return request('/api/Beauty/beauty/cpInventoryOperationItem/deleteCpInventoryOperationItem', {
    method: 'POST',
    body: params,
  });
}

// 配件保存
export async function postCpInventory(params) {
  return request('/api/Beauty/beauty/cpInventory/postCpInventory', {
    method: 'POST',
    body: params,
  });
}

//配件盘点提交
export async function saveCpInventory(params) {
  return request('/api/Beauty/beauty/cpPurchaseDetail/saveBatchInventoryData', {
    method: 'POST',
    body: params,
  });
}

//配件盘点列表
export async function getZCCpInventoryList(params) {
  return request('/api/Beauty/beauty/cpInventory/getZCCpInventoryList', {
    method: 'POST',
    body: params,
  });
}

//总成盘点保存
export async function postCpAssembly(params) {
  return request('/api/Beauty/beauty/cpInventory/postCpAssembly', {
    method: 'POST',
    body: params,
  });
}

//总成盘点提交
export async function saveCpAssembly(params) {
  return request('/api/Beauty/beauty/cpPurchaseDetail/saveBatchAssemblyDate', {
    method: 'POST',
    body: params,
  });
}

//总成盘点单撤销
export async function undoCpAssembly(params) {
  return request('/api/Beauty/beauty/cpPurchaseDetail/withdrawAssemblyData', {
    method: 'POST',
    body: params,
  });
}

//配件盘点单撤销
export async function undoInventory(params) {
  return request('/api/Beauty/beauty/cpPurchaseDetail/withdrawInventoryData', {
    method: 'POST',
    body: params,
  });
}

//质保变更单

//分页查询
export async function listCpQualityChange(params) {
  return request(`/api/Beauty/beauty/cpQualityChange/getCpQualityChangeList`, {
    method: 'POST',
    body: params,
  });
}

//新增或修改
export async function addCpQualityChange(params) {
  return request('/api/Beauty/beauty/cpQualityChange/postCpQualityChange', {
    method: 'POST',
    body: params,
  });
}

//单个删除
export async function deleteCpQualityChange(params) {
  return request('/api/Beauty/beauty/cpQualityChange/deleteCpQualityChange', {
    method: 'POST',
    body: params,
  });
}

//获取详情
export async function getCpQualityChange(params) {
  return request('/api/Beauty/beauty/cpQualityChange/getCpQualityChange', {
    method: 'POST',
    body: params,
  });
}

//获取列详情
export async function getCpQualityChangeLine(params) {
  return request('/api/Beauty/beauty/cpQualityChange/getCpQualityChangeLine', {
    method: 'POST',
    body: params,
  });
}

//详情
export async function getCpInventory(params) {
  return request('/api/Beauty/beauty/cpInventory/getCpInventory', {
    method: 'POST',
    body: params,
  });
}

export async function getCpInventoryOperationItemList(params) {
  return request('/api/Beauty/beauty/cpInventoryOperationItem/getCpInventoryOperationItemList', {
    method: 'POST',
    body: params,
  });
}

//新增明细
export async function postCpInventoryOperationItem(params) {
  return request('/api/Beauty/beauty/cpInventoryOperationItem/postCpInventoryOperationItem', {
    method: 'POST',
    body: params,
  });
}

//新增总成盘点明细
export async function postCpAssemblyOperationItem(params) {
  return request('/api/Beauty/beauty/cpInventoryOperationItem/postCpAssemblyOperationItem', {
    method: 'POST',
    body: params,
  });
}

export async function getCpInventoryOperationItem(params) {
  return request('/api/Beauty/beauty/cpInventoryOperationItem/getCpInventoryOperationItemList', {
    method: 'POST',
    body: params,
  });
}

//列表
export async function getCpInventoryList(params) {
  return request('/api/Beauty/beauty/cpInventory/getCpInventoryList', {
    method: 'POST',
    body: params,
  });
}

// 供应商采购明细表
export async function findCgBillMaterialDetail(params) {
  return request('/api/Beauty/beauty/statisticsReport/findCgBillMaterialDetail', {
    method: 'POST',
    body: params,
  });
}

// 分公司采购月度分析表
export async function findCgAvgPriceBillMaterialDetail(params) {
  return request('/api/Beauty/beauty/statisticsReport/findCgAvgPriceBillMaterialDetail', {
    method: 'POST',
    body: params,
  });
}

// 供应商月度采购分析表
export async function findCgAvgPriceBillMaterialDetailCS(params) {
  return request('/api/Beauty/beauty/statisticsReport/findCgAvgPriceBillMaterialDetailCS', {
    method: 'POST',
    body: params,
  });
}

// 供应商总成采购明细表
export async function findCgAssemblyBuildDetail(params) {
  return request('/api/Beauty/beauty/statisticsReport/findCgAssemblyBuildDetail', {
    method: 'POST',
    body: params,
  });
}

// 总成采购总成月度分析表
export async function findCgAvgPriceAssemblyBuildDetail(params) {
  return request('/api/Beauty/beauty/statisticsReport/findCgAvgPriceAssemblyBuildDetail', {
    method: 'POST',
    body: params,
  });
}

// 总成采购总成月度分析表(供应商)
export async function findCgAvgPriceAssemblyBuildDetailCS(params) {
  return request('/api/Beauty/beauty/statisticsReport/findCgAvgPriceAssemblyBuildDetailCS', {
    method: 'POST',
    body: params,
  });
}

// 月度采购应付款明细表
export async function findMonthCgDueMoneyDetail(params) {
  return request('/api/Beauty/beauty/statisticsReport/findMonthCgDueMoneyDetail', {
    method: 'POST',
    body: params,
  });
}

// 月度供应商应付款汇总表
export async function findMonthCgSupDueMoneyDetail(params) {
  return request('/api/Beauty/beauty/statisticsReport/findMonthCgSupDueMoneyDetail', {
    method: 'POST',
    body: params,
  });
}

// 配件销售明细利润表
export async function findAccessoriesSalesDetail(params) {
  return request('/api/Beauty/beauty/statisticsReport/findAccessoriesSalesDetail', {
    method: 'POST',
    body: params,
  });
}

// 公司业务员产值占比表
export async function findSalesmanProductionValueGraph(params) {
  return request('/api/Beauty/beauty/statisticsReport/findSalesmanProductionValueGraph', {
    method: 'POST',
    body: params,
  });
}

// 售后结案单成本统计表
export async function findAfterSalesCost(params) {
  return request('/api/Beauty/beauty/statisticsReport/findAfterSalesCost', {
    method: 'POST',
    body: params,
  });
}

// 售后结案单成本统计表饼图
export async function getAfterSalesFigureDrawing(params) {
  return request('/api/Beauty/beauty/statisticsReport/getAfterSalesFigureDrawing', {
    method: 'POST',
    body: params,
  });
}

// 售后结案单成本统计表曲线图
export async function getAfterGraphDate(params) {
  return request('/api/Beauty/beauty/statisticsReport/getAfterGraphDate', {
    method: 'POST',
    body: params,
  });
}

// 总成维修销售统计表
export async function findAssemblyWxAndXsStatistical(params) {
  return request('/api/Beauty/beauty/statisticsReport/findAssemblyWxAndXsStatistical', {
    method: 'POST',
    body: params,
  });
}

// 总成维修销售统计曲线图
export async function getAssemblyWxAndXsGraphDate(params) {
  return request('/api/Beauty/beauty/statisticsReport/getAssemblyWxAndXsGraphDate', {
    method: 'POST',
    body: params,
  });
}

// 客户统计分析表
export async function findCustomerSalesNumber(params) {
  return request('/api/Beauty/beauty/statisticsReport/findCustomerSalesNumber', {
    method: 'POST',
    body: params,
  });
}


// 客户统计分析表  曲线图
export async function getCustomerSalsesGraphDate(params) {
  return request('/api/Beauty/beauty/statisticsReport/getCustomerSalsesGraphDate', {
    method: 'POST',
    body: params,
  });
}

// 金额变更后产值表
export async function findTotalOutMoneyChange(params) {
  return request('/api/Beauty/beauty/statisticsReport/findTotalOutMoneychange', {
    method: 'POST',
    body: params,
  });
}

// 配件出入库统计分析  
export async function findAccessoriesInAndOutAnalyze(params) {
  return request('/api/Beauty/beauty/statisticsReport/findAccessoriesInAndOutAnalyze', {
    method: 'POST',
    body: params,
  });
}

// 售后施工单和售后结案单明细
export async function getOutBoundDetailLine(params) {
  return request('/api/Beauty/beauty/cpPurchaseDetail/getOutBoundDetailLine', {
    method: 'POST',
    body: params,
  });
}


export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params = {}) {
  return request(`/api/rule?${stringify(params.query)}`, {
    method: 'POST',
    data: {
      ...params.body,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    data: params,
  });
}

export async function fakeChartData() {
  if (usePromise) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(getFakeChartData);
      }, 1200);
    });
  }
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile(id) {
  return request(`/api/profile/basic?id=${id}`);
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  if (usePromise) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(login(params));
      }, 1200);
    });
  }
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    data: params,
  });
}

export async function queryNotices(params = {}) {
  return request(`/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}

// 配件申购单列表 
export async function listSubscribeFrom(params) {
  return request('/api/Beauty/beauty/cpMaterialPurchase/getCpMaterialPurchaseList', {
    method: 'POST',
    body: params,
  });
}

// 配件申购列表详情列表
export async function getCpMaterlalPurchaseDetailList(params) {
  return request('/api/Beauty/beauty/cpMaterlalPurchaseDetail/getCpMaterlalPurchaseDetailList', {
    method: 'POST',
    body: params,
  });
}


// 材料申购单   详情明细
export async function getCpMaterialPurchase(params) {
  return request('/api/Beauty/beauty/cpMaterialPurchase/getCpMaterialPurchase', {
    method: 'POST',
    body: params,
  });
}

// 材料申购单  过滤字段  
export async function getCpMaterialPurchaseLine(params) {
  return request('/api/Beauty/beauty/cpMaterialPurchase/getCpMaterialPurchaseLine', {
    method: 'POST',
    body: params,
  });
}

// 物料查询 查询 
export async function getMaterialQuery(params) {
  return request('/api/Beauty/beauty/cpPurchaseDetail/getMaterialQuery', {
    method: 'POST',
    body: params,
  });
}
