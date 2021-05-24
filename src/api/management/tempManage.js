import request from '@/utils/request'

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

// 编辑模板标签
export const editTempTag = data => request.post('/videomis/templet/editTags', data)

// 获取一个模板的标签
export const getTempTag = params => request.get('/videomis/templet/getTempletTags', { params })

// // config

// 获取模板明细
export const queryTempDetail = data => request.post('/videomis/templet/queryDetail', {},{params:data})

// 编辑模板明细
export const editTempDetail = data => request.post('/videomis/templet/editDetail', data)

// 新增模板明细
export const addTempDetail = data => request.post('/videomis/templet/addDetail', data)

// 启用模板点位
export const enableTempDetail = data => request.get('/videomis/templet/enableDetail', {params:data})

// 禁用模板点位
export const disableTempDetail = data => request.get('/videomis/templet/disableDetail', {params:data})
