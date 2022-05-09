import request from '@/utils/request'
import qs from 'qs'

const url = 'v1/indDimInfo/indDimInfos'

export function getDimInfos(params) {
   return request({
      url: 'v1/indDimInfo/indDimInfos' + '?' + qs.stringify(params, { indices: false }),
      method: 'get'
   })
}
export function getDimInfoList(params) {
   return request({
      url: 'v1/indDimInfo/indDimInfos/queryDimPageList' + '?' + qs.stringify(params, { indices: false }),
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
