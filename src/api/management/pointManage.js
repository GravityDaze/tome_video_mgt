import request from '@/utils/request'
/*
    点位管理api
*/

// 点位查询
export const queryPointList = data => request.post('/videomis/point/query',data)

// 启用点位
export const enablePoint = data => request.get('/videomis/point/enable',{params:data})

// 禁用点位
export const disablePoint = data => request.get('/videomis/point/disable',{params:data})

// 点位信息查询
export const queryPoint = data => request.get('/videomis/point/get',{params:data})

// 点位信息编辑
export const editPoint = data => request.post('/videomis/point/edit',data)

// 点位信息新增
export const addPoint = data => request.post('/videomis/point/add',data)
