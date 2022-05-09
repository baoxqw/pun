import request from '@/utils/request'

const url = 'v1/indicators/indDimensions'

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

export function getDimListById(data) {
  return request({
    url: url + '/indicatorId',
    method: 'post',
    data
  })
}

export function getValueListByTableAndColumn(tableName, columnName, datasourceId) {
  return request({
    url: url + '/' + tableName + '/' + columnName + '/' + datasourceId,
    method: 'get'
  })
}

export function edit(data) {
  return request({
    url: url,
    method: 'put',
    data
  })
}

export function getKeyValueByDimCode(dimCode) {
  return request({
    url: url + '/getKeyValueByDimCode/' + dimCode,
    method: 'get'
  })
}

export default { url, method: { add, edit, del }}
