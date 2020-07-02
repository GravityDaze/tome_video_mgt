import request from '../utils/request'

/*  
 * 审核管理相关api
 */

//  查询视频接口
export const queryVideoList = data => request.post('/videomis/examine/query', data)

//  查询当前是否有正在审核的视频
export const queryChecking = () => request.get('/videomis/examine/existed')

// 开启一个视频的审核
export const checkStartApi = params => request.get('/videomis/examine/appoint', { params })

// 确认视频上传结果
export const uploadFinishApi = data => request.post('/videomis/examine/upload', data)

// 审核通过/不通过
export const postAuditStatus = data => request.post('/videomis/examine/result', data)
