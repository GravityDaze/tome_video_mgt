import request from '@/utils/request'

/*  
 * 小视频管理相关api
 */

//  小视频管理 => smallVideoManage.vue 

//  查询视频列表
export const queryVideoList = data => request.post('videomis/video/query', data)

// 查询景区列表
export const getSceneryList = params => request.get('/videomis/scenery/dropDown',  {params})

// 添加视频
export const addVideo = data => request.post('videomis/video/add', data)

// 修改视频
export const updateVideo = data => request.post('videomis/video/update', data)

// 需求选择
export const queryNeed = data => request.post('videomis/need/queryNeed', data)

// 视频置顶
export const sticky = params => request.get('/videomis/video/top', {params})

// 视频取消置顶
export const cancelSticky = params => request.get('/videomis/video/topCancel',  {params})

// 视频推荐'
export const recommendFn = params => request.get('/videomis/video/recommend',  {params})

// 视频取消推荐
export const cancelRecommend = params => request.get('/videomis/video/recommendCancel',  {params})

// 空镜头模板 => sceneryShotTemplate.vue

// 合成视频模板信息列表查询
export const queryTemplateList = data => request.post('/videomis/templet/query', data)

// 合成信息模板新增
export const addTemplate = data => request.post('/videomis/templet/add', data)

//合成视频模板信息查询
export const queryTemplateInfo = params => request.get('/videomis/templet/query', { params })

// 合成视频模板信息编辑
export const editTemplate = data => request.post('/videomis/templet/edit', data)

// 合成视频模板禁用
export const disableTemplate = params => request.get('/videomis/templet/disable', { params })

// 合成视频模板启用
export const enableTemplate = params => request.get('/videomis/templet/enable', { params })

// 模板片段信息列表查询
export const queryTemplatePoint = data => request.post('/videomis/templetPoint/query', data)

// 模板片段信息新增
export const addTemplatePoint = data => request.post('/videomis/templetPoint/add', data)

// 模板片段信息获取
export const getTemplatePoint = data => request.post('/videomis/templetPoint/get', data)

// 模板片段信息编辑
export const editTemplatePoint = data => request.post('/videomis/templetPoint/edit', data)

// 模板片段信息禁用
export const disableTemplatePoint = params => request.get('/videomis/templetPoint/disable', { params })

// 模板片段信息启用
export const enableTemplatePoint = params => request.get('/videomis/templetPoint/enable', { params })