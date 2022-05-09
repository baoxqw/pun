import request from '@/utils/request'

const url = 'v1/indicators/indAtomInfos'

export function getGenInd() {
  return request({
    url: url + '/atom/getGenInd',
    method: 'get'
  })
}

export function getGenAndDerivedInd() {
  return request({
    url: url + '/atom/getGenAndDerivedInd',
    method: 'get'
  })
}

export function getAllInds() {
  return request({
    url: url + '/atom/getAllInds',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: url,
    method: 'delete',
    data: ids
  })
}
export function delAtom(ids) {
  return request({
    url: url + "/deleteByIds?ids=" + ids,
    method: 'post'
  })
}
export function edit(data) {
  return request({
    url: url,
    method: 'put',
    data
  })
}
export function updateAtom(data) {
  return request({
    url: url,
    method: 'put',
    data
  })
}
export function bizCalcSqlVali(data) {
  return request({
    url: 'v1/indicators/indAtomInfos/bizCalcSqlVali',
    method: 'post',
    data
  })
}
export function getDimensions(data) {
  return request({
    url: 'v1/indicators/indAtomInfos/atom/getDimensions',
    method: 'post',
    data
  })
}
export function getTablesById(dataSourceId) {
  return request({
    url: 'v1/datasource/indDataTables/datasource/' + dataSourceId,
    method: 'get'
  })
}
export function getColumnByTabel(dataSourceId, tableName) {
  return request({
    url: 'v1/datasource/indDataColumns/' + dataSourceId + '/' + tableName,
    method: 'get'
  })
}
export function bizNameIsContract(id,bizName) {
  return request({
    url: url + '/bizNameIsContract?id=' + id + "&bizName=" + bizName,
    method: 'get'
  })
}
export function abolish(ids,signDeptIds) {//废止
  return request({
    url: url + '/abolish?ids=' + ids + "&signDeptIds=" + signDeptIds,
    method: 'post'
  })
}
export function startProcess(ids,signDeptIds) {
  return request({
    url: url + '/startProcess?ids=' + ids + "&signDeptIds=" + signDeptIds,
    method: 'post'
  })
}

/**
 * 审批链路
 * @param data
 */
export function approveDetailByBusinessKey(data) {
  return request({
    url: 'workflow/myTask/approveDetailByBusinessKey?' + data,
    method: 'get',
    data
  })
}
/**
 * 审批链路
 * @param data
 */
export function approveDetailByOriginalInstId(data) {
  return request({
    url: 'workflow/myTask/approveDetailByOriginalInstId?' + data,
    method: 'get',
    data
  })
}
export function getHisList(ieId) {
  console.log(">>>>>>>>>>> " + ieId)
  return request({
    url: url + '/getHisPageList?size=100&page=0&ieId=' + ieId,
    method: 'get',
    data:{
      'ieId':ieId
    }
  })
}
export function getAtomListByIds(ids) {
  return request({
    url: url + '/getAtomListByIds?&ids=' + ids,
    method: 'get'
  })
}
export function getDimListByIeIds(ieIds) {
  return request({
    url: url + '/getDimListByIeIds?&ieIds=' + ieIds,
    method: 'get'
  })
}
export function checkRef(ids) {
  return request({
    url: url + '/checkRef?ids=' + ids,
    method: 'get'
  })
}
export function getAtomListByVerifyNo(verifyNo) {
  return request({
    url: url + '/getAtomListByVerifyNo?&verifyNo=' + verifyNo,
    method: 'get'
  })
}
export function addIndToSelfCategory(ids,categoryId) {
  return request({
    url: url + '/addIndToSelfCategory?ids=' + ids + "&categoryId=" + categoryId,
    method: 'post'
  })
}
export default { url, crud: { add, edit, del }}
