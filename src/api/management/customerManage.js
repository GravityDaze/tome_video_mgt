import request from '@/utils/request'

/*  
 * 用户管理api
 */

// 用户查询
export const queryCustomer = data => request.post('/videomis/customer/query',data)

// 用户启用
export const enableCustomer = params => request.get('/videomis/customer/enable',{ params })

// 用户禁用
export const disableCustomer = params => request.get('/videomis/customer/disable',{ params })

// 查询用户信息
export const queryCustomerInfo = params => request.get('/videomis/customer/get',{ params })

// 查询用户需求明细
export const queryCustomerDemand = data => request.post('/videomis/need/queryByCustomer',data)