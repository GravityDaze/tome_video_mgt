import request from '../utils/request'

/*  
 * 用户功能api
 */

// 获取登录验证码
export const getCode = ()=> request.get('/v/sysCode')

// 登录
export const login = data => request.post('/v/sysLogin',data)

// 注销
export const logout = data=> request.post('/v/sysLogout',data)

// 获取该用户的菜单信息
export const  getMenu = ()=> request.get('/videomis/menu/auth')

// 刷新用户token
export const refreshToken = params => request.get('/v/sysRefresh',{ params })

// 获取用户个人资料
export const queryUserInfo = () => request.get('/videomis/user/userInfo')

// 编辑用户个人资料
export const editUserInfo = data => request.post('/videomis/user/editUserInfo',data)