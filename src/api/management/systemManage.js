import request from '@/utils/request'

/*  
 * 系统管理相关api
 */

// 菜单管理 => systemManage.vue

// 获取菜单树
export const getMenuTree = () => request.get('/videomis/menu/tree')

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
export const queryOperator = data => request.post('/videomis/user/query', data)

// 操作员新增
export const addOperator = data => request.post('/videomis/user/add', data)

// 操作员信息
export const operatorInfo = params => request.get('/videomis/user/get', { params })

// 操作员编辑
export const editOperator = data => request.post('/videomis/user/edit', data)

// 操作员授权角色信息
export const operatorGetAuth = params => request.get('/videomis/user/getAuth', { params })

// 操作员授权角色
export const operatorAuth = data => request.post('/videomis/user/auth', data)

// 操作员启用
export const enableOperator = params => request.get('/videomis/user/enable', { params })

// 操作员禁用
export const disableOperator = params => request.get('/videomis/user/disable', { params })

// 操作员弃用
export const closeOperator = params => request.get('/videomis/user/close', { params })

// 操作员重置密码
export const resetPw = params => request.get('/videomis/user/resetPw', { params })

// 标签管理 => tagManage.vue

// 标签列表查询
export const queryTags = data => request.post('/videomis/tags/query', data)

// 新增标签
export const addTag = data => request.post('/videomis/tags/add', data)

// 标签编辑
export const editTag = data => request.post('/videomis/tags/edit', data)

// 启用标签
export const enableTag = params => request.get('/videomis/tags/enable', { params })

// 禁用标签
export const disableTag = params => request.get('/videomis/tags/disable', { params })

// 标签选择查询
export const tagsSelect = params => request.get('/videomis/tags/select', { params })

// 角色管理 => roleManage.vue

// 角色列表查询
export const queryRole = data => request.post('/videomis/role/query', data)

// 角色新增
export const addRole = data => request.post('/videomis/role/add', data)

// 角色编辑
export const editRole = data => request.post('/videomis/role/edit', data)

// 角色启用
export const enableRole = params => request.get('/videomis/role/enable', { params })

// 角色禁用
export const disableRole = params => request.get('/videomis/role/disable', { params })

// 分配角色授权信息
export const getAssignableAuth = params => request.get('/videomis/role/getAssignableAuth', { params })

// 分配角色授权
export const assignableAuth = data => request.post('/videomis/role/assignableAuth', data)

// 功能授权信息
export const getMenuAuth = params => request.get('/videomis/role/getMenuAuth', { params })

// 功能授权
export const menuAuth = data => request.post('/videomis/role/menuAuth', data)

// 系统参数 => systemParams.vue 

// 查询系统参数
export const queryParams = data => request.post('/videomis/param/query',data)

// 新增系统参数
export const addParams = data => request.post('/videomis/param/add',data) 

// 编辑系统参数
export const editParams = data => request.post('/videomis/param/edit',data) 

// 同步参数到redis
export const paramsSync = params => request.get('/videomis/param/sycn',params)

// 区域管理 => areaManage.vue

// 查询区域
export const queryArea = data => request.post('/videomis/area/query',data)

// 新增区域
export const addArea = data => request.post('/videomis/area/add',data)

// 编辑区域
export const editArea = data => request.post('/videomis/area/edit',data)

// 启用区域
export const enableArea = params => request.get('/videomis/area/enable',{params})

// 禁用区域
export const disableArea = params => request.get('/videomis/area/disable',{params})