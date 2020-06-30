import request from '@/utils/request'
/*
    销售结算管理api
*/

// 价格配置模块 => priceSetManage.vue

// 价格配置查询
export const queryPrinceConfig = data => request.get('/videomis/priceConfig/query',data)

// 价格配置新增
export const addPrinceConfig = data => request.post('/videomis/priceConfig/add',data)

// 价格配置删除
export const delPrinceConfig = data => request.post('/videomis/priceConfig/delete',data)

