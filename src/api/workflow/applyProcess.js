import request from '@/utils/request'

const url = 'workflow/myTask'

/**
 * 我的申请
 * @param data
 */
export function appliedProcess(data) {
    return request({
        url: url + '/appliedProcess',
        method: 'post',
        data
    })
}

/**
 * 审批链路
 * @param data
 */
export function approveDetail(data) {
    return request({
        url: url + '/approveDetail?' + data,
        method: 'get',
        data
    })
}


export function completeTask(data) {
    return request({
        url: 'workflow/task/completeTask?' + data,
        method: 'get',
        data
    })
}


/*
export default { url, appliedProcess, approveDetail }*/
