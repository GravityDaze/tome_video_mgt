import request from '@/utils/request'

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

// 操作员管理 => operatorManage.vue

// 操作员查询
export const queryOperator = data => request.post('/videomis/user/query', data )

// 操作员新增
export const addOperator = data => request.post('/videomis/user/add', data )

// 操作员信息
export const operatorInfo = params => request.get('/videomis/user/get', { params } )

// 操作员编辑
export const editOperator = data => request.post('/videomis/user/edit', data )

// 操作员授权角色信息
export const operatorGetAuth = params => request.get('/videomis/user/getAuth', { params } )

// 操作员授权角色
export const operatorAuth = data => request.post('/videomis/user/auth', data )

// 操作员启用
export const enableOperator = params => request.get('/videomis/user/enable', { params } )

// 操作员禁用
export const disableOperator = params => request.get('/videomis/user/disable', { params })

// 操作员弃用
export const closeOperator = params => request.get('/videomis/user/close', { params })

// 操作员重置密码
export const resetPw = params => request.get('/videomis/user/resetPw', { params })

