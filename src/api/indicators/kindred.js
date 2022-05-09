import request from '@/utils/request'

const url = 'v1/KindredRelationController/kindredRelation'

export function getData(bizCode) {
  return request({
    url: url+"/getData" + "?bizCode=" + bizCode,
    method: 'get'
  })
}