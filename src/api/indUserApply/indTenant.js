import request from '@/utils/request'

//const url = 'v1/indUserApply/indUserApplyInfos'

/**
 * 获取机构法人列表
 * @param data
 */
export function getTenants(data) {
    return request({
        url: 'workflow/myTask/getTenants',
        method: 'get',
        data
    })
}

/**
 * 判断是否是超级管理员
 * @param data
 * @returns {boolean}
 */
export function isSuperAdmin(data) {
    var cookies = document.cookie.split(";");
    if (cookies != null && cookies.length > 0) {
        var cookieRole = cookies.filter(function(itemObj){
            if (itemObj.indexOf("current.role") >= 0) {
                if (itemObj.indexOf("R000") > 0) {//超级管理员
                    return itemObj;
                }
            }
        })

        if(cookieRole != null && cookieRole.length > 0){
            if (decodeURIComponent(cookieRole).indexOf("R000") > 0) {
                //this.superAdminFlag = true;
                return true;
            }
        }
    }
    return false;
}