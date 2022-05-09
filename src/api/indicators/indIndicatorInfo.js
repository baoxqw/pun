import request from '@/utils/request'
//import CRUD, { presenter, header, form, crud } from '@crud/crud'

const url = 'v1/indicators/indIndicatorInfos'

export function add(data) {
  return request({
    url: url,
    method: 'post',
    data
  }).then(res => {
    if (res.code === 0) {
      const indIndicatorInfos = []
      const data2 = res.data
      const indIndicatorInfo = {
        'id': data2.id,
        'ieCode': data2.ieCode,
        'status': '1',
        'ieProp': data2.ieProp
      }
      indIndicatorInfos.push(indIndicatorInfo)
     return request({
        url: url + '/updateStatus',
        method: 'put',
        data: indIndicatorInfos
      })/*.then(ref => {
        console.log(ref.code )
        if (ref.code !== 0) {
          crud.notify('提交指标信息失败', CRUD.NOTIFICATION_TYPE.ERROR)
          return false
        } else {
        }
      })*/
    }else{
      this.$message({
        message: '指标提交失败',
        type: 'warning'
      })
    }
  })
}

export function del(ids) {
  return request({
    url: url,
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: url,
    method: 'put',
    data
  })
}

export function getDimInfo() {
  return request({
    url: 'v1/indicators/indDimensions/dim/all',
    method: 'get'
  })
}

export function getAllSource() {
  return request({
    url: 'v1/datasource/indDatasources2/source/all',
    method: 'get'
  })
}
export function getAtom(data) {
  return request({
    url: 'v1/indicators/indAtomInfos/atom/byDataSource',
    method: 'post',
    data
  })
}
export function getAllAtomInfos(data) {
  return request({
    url: 'v1/indicators/indAtomInfos/atom/getAllAtomInfos',
    method: 'get',
    data
  })
}
export function getAtomDimenston(data) {
  return request({
    url: 'v1/indicators/indAtomDimensions/atom/getAtomDimenstonByBizCode',
    method: 'post',
    data
  })
}

export function getTables(data) {
  return request({
    url: 'v1/database/tables/all',
    method: 'post',
    data
  })
}

export function getColumns(data) {
  return request({
    url: 'v1/database/columns/all',
    method: 'post',
    data
  })
}

export function saveArithmetic(data) {
  return request({
    url: 'v1/indicators/indDeriveRules/saveArithmetic',
    method: 'put',
    data
  })
}

export function getIndDeriveRule(ieCodes) {
  return request({
    url: 'v1/indicators/indDeriveRules/getIndDeriveRule',
    method: 'post',
    data: ieCodes
  })
}
export function getIndDeriveRuleByIeCode(data) {
  return request({
    url: 'v1/indicators/indDeriveRules/getIndDeriveRuleByIeCode',
    method: 'post',
    data
  })
}
export function updateStatuesByIeCode(data) {
  return request({
    url: url + '/updateStatuesByIeCode',
    method: 'put',
    data
  })
}

export function calculate(data) {
  return request({
    url: 'v1/indicators/indDeriveRules/calculate',
    method: 'put',
    data
  })
}
export function updateStatus(data) {
  return request({
    url: url + '/updateStatus',
    method: 'put',
    data
  })
}

export function updateDeriveStarStatus(data) {
  return request({
    url: url + '/updateDeriveStarStatus',
    method: 'put',
    data
  })
}

export function checkexpression(data) {
  return request({
    url: 'v1/indicators/indDeriveRules/checkexpression',
    method: 'post',
    data
  })
}

export function getBaseIndicatorByIeCode(id) {
  return request({
    url: url + '/getBaseIndicatorByIeCode/' + id,
    method: 'get'
  })
}

export function getByIeCode(ieCode) {
  return request({
    url: url + '/getByIeCode/' + ieCode,
    method: 'get'
  })
}
export function process(data, type) {
  return request({
    url: 'v1/indicator/' + type + '/process',
    method: 'post',
    data
  })
}
export function saveBaseRule(data) {
  return request({
    url: url + '/saveBaseRule',
    method: 'put',
    data
  })
}

export function getIndBaseRule(ieCodes) {
  return request({
    url: 'v1/indicators/indBaseRules/getIndBaseRule',
    method: 'post',
    data: ieCodes
  })
}

export function checkDept(data) {
  return request({
    url: url + '/checkDept' + '?manageDept=' + data,
    method: 'get',
    data
  })
}
export function getIeCodeHistoryList(data) {
  return request({
    url: url + '/ieHis',
    method: 'get',
    data
  })
}
export default { url, method: { add, edit, del }}
