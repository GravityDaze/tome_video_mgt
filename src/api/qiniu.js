import request from '@/utils/request'
/*
    七牛云相关api
*/

// 获取七牛云通用上传token
export const getPublicUploadParams = params => request.get('/videomis/upload/uploadAuth',{ params })

// 获取七牛云视频上传token
export const getUpLoadParams = params => request.get('/videomis/upload/uploadExamineAuth', { params })
