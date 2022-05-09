import request from '@/utils/request'

const url = 'v1/indicators/noticeInfo'

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
export function topNotice(id,sortNo) {
  return request({
    url: url + "/topNotice/" + id +"/" + sortNo,
    method: 'get'
  })
}
export default { url ,crud: { add, edit, del } }
