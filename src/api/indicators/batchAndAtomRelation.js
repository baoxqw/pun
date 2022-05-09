import request from '@/utils/request'

const url = 'v1/indicators/batchAndAtomRelation'


export function getListBybatchCode(batchCode) {
  return request({
    url: url+'/getListBybatchCode?batchCode='+batchCode,
    method: 'get',
  })
}

export function getSelectedListBybatchCode(batchCode) {
  return request({
    url: url+'/getSelectedListBybatchCode?batchCode='+batchCode,
    method: 'get',
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

export function edit(data) {
  return request({
    url: url,
    method: 'put',
    data
  })
}

export default { url ,crud: { add, edit, del } }
