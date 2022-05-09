import request from '@/utils/request'
import qs from 'qs'

const url = 'v1/indicators/indResultSubscribe'
const url2 = 'v1/metamodel'


export function download(query) {
  return request({
    url: '/new/data/dataModelTable/exportData',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}
//导入
export function importTemp(data) {
  return request({
    url: `/new/data/dataModelTable/importTemp`,
    method: "post",
    data
  })
}

//下载
export function importExcel(query) {
  return request({
    url: `/new/data/dataModelTable/excelDownload`,
    method: "get",
    params: query
  })
}

export function getDatabases(query) {
  return request({
    url: '/new/data/dataModelTable/getDatabases',
    method: 'get',
    params: query
  })
}

export function getTableNames(query) {
  return request({
    url: '/new/data/dataModelTable/getTableNames',
    method: 'get',
    params: query
  })
}

export function getTableColumns(query) {
  return request({
    url: '/new/data/dataModelTable/getTableColumns',
    method: 'get',
    params: query
  })
}

export function syncColumns(query) {
  return request({
    url: '/new/data/dataModelTable/syncColumns',
    method: 'get',
    params: query
  })
}


// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
  console.log("dictType:"+dictType);
  return request({
    url: '/new/system/dict/data/type/' + dictType,
    method: 'get'
  })
}


// 查询用户列表
export function listUser(query) {
  return request({
    url: '/new/system/user/list',
    method: 'get',
    params: query
  })
}


// 需求列表查询
export function dataDemandList(query) {
  return request({
    url: "/new/data/dataDemandInfo/list",
    method: "get",
    params: query
  });
}

// 模型新增、更新 post, put
export function dataModelTable(data, type, urls) {
  return request({
    url: "/new/data/dataModelTable"+urls,
    method: type,
    data
  });
}

// 模型删除
export function dataModelRemove(data) {
  return request({
    url: `/new/data/dataModelTable/removeBatch`,
    method: "post",
    data
  });
}

//模型查询
export function dataModelQuery(query) {
  return request({
    url: "/new/data/dataModelTable/list",
    method: "get",
    params: query
  });
}

//模型字段（批量）修改
export function updateDataModelTable(data) {
  return request({
    url: "/new/data/dataModelColumn/editBatch",
    method: "put",
    data
  });
}

//模型字段（批量）新增
export function addBatchModelColumn(data) {
  return request({
    url: "/new/data/dataModelColumn/addBatch",
    method: "post",
    data
  });
}

// 模型字段删除
export function dataModelColumnRemove(data) {
  return request({
    url: "/new/data/dataModelColumn/remove",
    method: "put",
    data
  });
}

//模型SQL查询
export function sqlText(query) {
  return request({
    url: "/new/data/dataModelTable/sqlText",
    method: "get",
    params: query
  });
}

//校验录入字段
export function checkWord(query) {
  return request({
    url: "/new/data/dataModelColumn/checkWord",
    method: "get",
    params: query
  });
}

//模型字段查询
export function queryTableColumn(query) {
  return request({
    url: "/new/data/dataModelColumn/list",
    method: "get",
    params: query
  });
}


//数据源字段查询
export function getDataSourceNames(query) {
  return request({
    url: "/new/data/dataModelTable/getDataSourceNames",
    method: "get",
    params: query
  });
}


export function getTableList() {
  return request({
    url: url2 + '/tables/queryList',
    method: 'get'
  })
}

export function queryByTableId(data) {
  return request({
    url: url2 + '/cols/queryByTableId?tableId='+data,
    method: 'get'
  })
}