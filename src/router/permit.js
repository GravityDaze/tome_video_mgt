import router from './index.js'
import { filterRouter } from  '../utils/filterRouter'
import store from '../store'
import { Message } from 'element-ui'

// 全局前置守卫
router.beforeEach( (to,from,next)=>{
  // 如果直接进入登录页则放行
  if(to.path === "/login"){
    next()
  }else{
    const token = store.getters.token
    // 如果token存在则放行
    if(token){
      // 根据后台返回的数据加载动态路由
      // filterRouter()
      // router.addRoutes(filterRouter())
      // next({...to,replace:true})
      next()
    }else{
      Message.warning('请先登录')
      next('/login')
    }
  }
} )