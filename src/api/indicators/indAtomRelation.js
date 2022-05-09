import request from '@/utils/request'

const url = 'v1/IndAtomRelationController/indAtomRelations'

export function getData(bizName) {
  return request({
    url: url+"/getData" + "?bizName=" + bizName,
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

export function edit(data) {
  return request({
    url: url,
    method: 'put',
    data
  })
}

export default { url ,crud: { add, edit, del } }
