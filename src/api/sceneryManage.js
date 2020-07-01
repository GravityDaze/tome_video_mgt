import request from '../utils/request'

/*  
 * 景区管理相关api
 */

// 获取景区列表
export const getSceneryList = data => request.post('videomis/scenery/query',data)

// 根据id查询景区详情
export const querySceneryDetail = params => request.get('videomis/scenery/detail',{ params })

// 根据id查询景区信息
export const querySceneryInfo = params => request.get('videomis/scenery/get',{ params })

// 添加景区
export const addScenery = data => request.post('videomis/scenery/add', data)

// 修改景区
export const editScenery = data => request.post('videomis/scenery/update',data)

// 删除景区
export const delScenery = params => request.get('videomis/scenery/delete',{params})

// 开启视频服务
export const serviceEnable =  params => request.get('videomis/scenery/enableService',{params})

// 禁用视频服务
export const serviceDisable = params => request.get('videomis/scenery/disableService',{params})

// 设置热门景区
export const setHotScenery = params => request.get('/videomis/scenery/hot',{params})

// 取消热门景区
export const cancelHotScenery = params => request.get('/videomis/scenery/hotCancel',{params})

// 获取景区标签信息
export const getSceneryTags = params => request.get('/videomis/scenery/getSceneryTags',{params})

// 编辑景区标签信息
export const editSceneryTags =  params => request.get('/videomis/scenery/editTags',{params})
