import request from '@/utils/request'

const url = 'v1/IndAtomBatchController/indAtomBatch'

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

export function getBatchInfo() {
  return request({
    url: 'v1/IndAtomBatchController/indAtomBatch/queryList',
    method: 'get'
  })
}

export default { url, method: { add, edit, del }}