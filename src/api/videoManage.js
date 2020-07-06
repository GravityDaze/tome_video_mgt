import request from '../utils/request'

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