import request from '@/utils/request'

const url = 'v1/indicators/indIndicatorManuals'

export function getData() {
  return request({
    url: url+"/getData",
    method: 'get'
  })
}

export function getData2Api() {
  return request({
    url: url+"/getData2Api",
    method: 'get'
  })
}

export function getDept() {
  return request({
    url: url+"/getDept",
    method: 'get'
  })
}
export function findToApproveInd() {
  return request({
    url: url+"/findToApproveInd",
    method: 'get'
  })
}
export function findIndByApproveId(approveId) {
  return request({
    url: url+"/findIndByApproveId?approveId="+approveId,
    method: 'get'
  })
}
export function importExcel(formData) {
  return request({
    url: url+"/import",
    method: 'post',
    data:formData
  })
}
export function toApprove(ids) {
  return request({
    url: "/workflow/task/startTask" + "?procKey=ZB_BL&businessKey=" + ids,
    method: 'get'
  })
}
export function updateApproveStatus(ids,infoIds,submitDescribe) {
  return request({
    url: url+"/updateApproveStatus" + "?ids=" + ids+"&infoIds="+infoIds+"&describe="+submitDescribe,
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

export default { url ,method: { add, edit, del } }
