import request from '../utils/request'

// 获取菜单信息
export const  getMenu = ()=> request.get('/videomis/menu/auth')