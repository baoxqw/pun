import request from '@/utils/request'

const url = 'workflow/procDef'

/**
 * 查询自定义节点
 * @param data
 */
export function handleCustomNode(data) {
    return request({
        url: url + '/handleCustomNode?'+data,
        method: 'get'
    })
}

export function pubGraph(data) {
    return request({
        url: url + '/dealProcDef',
		method: 'post',
		data
    })
}

/**
 * 查询部门
 */
export function loadDept(){
	return request({
		url: '/api/dept',
		method: 'get'
	})
}

/**
 * 查询岗位
 */
export function loadPosi(data){
	return request({
		url: 'system/dept/queryDeptJob?' + data,
		method: 'get'
	});
}

/**
 * 加载流程图
 */
export function loadGraph(param){
	return request({
		url: url + '/getProcDefList?'+param,
		method: 'get'
	})
}
export function checkDeptUser(param) {
	return request({
		url: url + '/checkDeptUser?deptIds='+param,
		method: 'get'
	})
}