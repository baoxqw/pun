import request from '@/utils/request'

const url = 'v1/indicators/indResultSubscribe'

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
// 获取指标校验规则
export function getCheckList(data) {
  return request({
    url: 'v1/indicators/result/atom/getCheckList',
    method: 'get',
    data
  })
}

/**
 * 保存指标校验规则
 * @param data
 */
export function saveCheckData(data) {
  return request({
    url: 'v1/indicators/result/atom/saveCheckData?' + data,
    method: 'get',
    data
  })
}

/**
 * 删除指标规则
 * @param data
 */
export function deleteCheckData(data) {
  return request({
    url: 'v1/indicators/result/atom/deleteCheckData?' + data,
    method: 'get',
    data
  })
}

/**
 * 获取结果表中的机构信息
 * @param data
 */
export function getResultDepts(data) {
  return request({
    url: 'v1/indicators/result/atom/getResultDepts',
    method: 'get',
    data
  })
}


export default { url, crud: { add, edit, del }}
