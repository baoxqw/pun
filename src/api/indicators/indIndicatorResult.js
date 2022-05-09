import request from '@/utils/request'

const url = 'v1/indicators/indIndicatorResults'

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
export function addFavorites(ids) {
  return request({
    url: url +"/addFavorites/" + ids,
    method: 'put',
    data: null
  })
}
export function removeFavorites(ids) {
  return request({
    url: url +"/removeFavorites/" + ids,
    method: 'put',
    data: null
  })
}
export function saveReadRec(id) {
  console.log("dsaaaaaaaa   " + id)
  return request({
    url: url + "/saveReadRec/" + id,
    method: 'put',
    data: null
  })
}
export default { url, crud: { add, edit, del }}
