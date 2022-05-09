import request from '@/utils/request'

const url = 'v1/indicators/indCategorys'

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

export function tree(type, parentId) {
  return request({
    url: url + `/${type}/${parentId}`,
    method: 'get'
  })
}

export function treeInfo(type, parentId) {
  return request({
    url: url + `/treeInfo/${type}/${parentId}`,
    method: 'get'
  })
}

export function treeByTable(type) {
  return request({
    url: url + `/treeByTable/${type}`,
    method: 'get'
  })
}
export function getCategoryList(data) {
  return request({
    url: url + `/getCategoryList/${data}`,
    method: 'get'
  })
}
export async function getCategoryName(id) {
  return request({
    url: url + `/getCategoryName/${id}`,
    method: 'get'
  })
}
export default { url, tree, treeInfo, treeByTable,getCategoryList,getCategoryName, crud: { add, edit, del }}
