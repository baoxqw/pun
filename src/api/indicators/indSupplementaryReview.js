import request from '@/utils/request'

const url = 'v1/indicators/indSupplementaryReviews'

export function toApprove(ids,infoIds,approveStatus) {
  return request({
    url: url+"/toApprove?ids=" + ids+"&infoIds="+infoIds+"&approveStatus="+approveStatus,
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
