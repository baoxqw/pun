import request from '@/utils/request'

const url = 'v1/indicators/apiAndAtomRelation'


export function getListByApiId(id) {
  return request({
    url: url+'/getListByApiId?apiId='+id,
    method: 'get',
  })
}

export function getSelectedListById(apiId) {
  return request({
    url: url+'/getSelectedListById?apiId='+apiId,
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
