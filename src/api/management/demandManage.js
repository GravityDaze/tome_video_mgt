import request from '@/utils/request'

/*  
 * 制作需求管理api
 */

//  查询需求列表
export const queryDemand = data => request.post('videomis/need/query', data)

