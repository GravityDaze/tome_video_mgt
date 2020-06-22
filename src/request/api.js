import request from '../utils/request'

/*  
 * 登录模块 
 * login.vue 
 */

// 获取登录验证码
export const getCode = ()=> request.get('/v/sysCode')

// 登录
export const login = data => request.post('/v/sysLogin',data)

// 获取菜单信息
export const  getMenu = ()=> request.get('/videomis/menu/auth')


/*  
 * layout.vue 
 */

 export const logout = data=> request.post('/v/sysLogout',data)