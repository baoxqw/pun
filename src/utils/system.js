import request from '@eladmin/utils/request'
export function getDepts(params) {
    return request({
        url: 'api/dept/getDeptTree',
        method: 'get',
        params
    })
}
export function getCurrentDept() {
    return request({
        url: 'api/dept/getCurrentDept',
        method: 'get'
    })
}