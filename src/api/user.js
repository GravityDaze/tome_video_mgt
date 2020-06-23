import request from '../utils/request'

/*  
 * 用户功能相关模块
 */

// 获取登录验证码
export const getCode = ()=> request.get('/v/sysCode')

// 登录
export const login = data => request.post('/v/sysLogin',data)

// 注销
export const logout = data=> request.post('/v/sysLogout',data)