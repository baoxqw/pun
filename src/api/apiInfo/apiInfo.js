import request from '@/utils/request'

const url = 'v1/indicators/api'

export function testInterface(id,name,businessDept,beginTime,endTime) {
  return request({
    url: url+"/getAtomList/"+id+"&name="+name+"&businessDept="+businessDept+"&beginTime="+beginTime+"&endTime="+endTime,
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
