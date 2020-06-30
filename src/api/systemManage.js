import request from '../utils/request'

/*  
 * 系统管理相关api
 */

// 菜单管理 => systemManage.vue

// 获取菜单树
export const getMenuTree = () => request.get('/videomis/menu/tree')

//  获取指定菜单的下级菜单集合
export const getSubMenu = params => request.get('/videomis/menu/listByParent', { params })

//  根据菜单ID查询下级菜单信息列表
export const querySubMenu = data => request.post('/videomis/menu/queryByParent', data)

// 菜单信息新增
export const addMenu = data => request.post('/videomis/menu/add', data)

// 菜单信息编辑
export const editMenu = data => request.post('/videomis/menu/edit', data)

// 菜单信息获取
export const getMenuInfo = params => request.get('/videomis/menu/get', { params })

// 菜单启用
export const enableMenu = params => request.get('/videomis/menu/enable', { params })

// 菜单禁用
export const disableMenu = params => request.get('/videomis/menu/disable', { params })