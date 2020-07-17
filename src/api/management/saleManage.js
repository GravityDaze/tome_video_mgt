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
export const delPrinceConfig = params => request.get('/videomis/priceConfig/delete',{ params })

// 订单管理模块 => orderManage.vue 

// 订单查询
export const orderQuery = data => request.post('/videomis/order/query',data)

// 修改订单状态为"已支付"
export const changeOrderStatus = data => request.post('/videomis/order/pay',data)

// 订单已退金额
export const refundPrice = params => request.get('/videomis/order/refundPrice',{ params })

// 订单退款
export const refund = data => request.post('/videomis/order/refund',data)

// 订单结算模块 => order

// 订单结算查询
export const queryOrderSettlement = data => request.post('/videomis/orderCount/query',data)

// 订单结算明细查询
export const queryOrderDetail = data => request.post('/videomis/orderCount/detail',data)