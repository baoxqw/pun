import request from '@/utils/request'
import qs from 'qs'

const url = 'v1/indicators/indDimensionDatas'

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

export function edit(data) {
  return request({
    url: url,
    method: 'put',
    data
  })
}

export function getDimTree(params) {
  return request({
    url: url + '/getDimTree' + '?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export default { url, method: { add, edit, del }}
