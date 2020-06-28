import router from './index.js'
import store from '@/store'
import { Message } from 'element-ui'

// 全局前置守卫 此处会出现报错 原因不明 但功能正常
router.beforeEach((to, from, next) => {
  const token = store.getters.token
  if (token) {
    if (to.path === '/login') {
      next('/')
    } else {
      if (store.getters.routerMap.length === 0) {
        store.dispatch('permission/getRouter').then(() => {
          router.addRoutes(store.getters.routerMap)
          next({ ...to, replace: true })
        }).catch(() => {
          next()
        })
        // 如果存在路由表 则正常跳转 
      } else {
        next()
      }
    }

  } else {
    if (to.path === '/login') {
      next()
    } else {
      Message.warning('请先登录')
      next('/login')
    }
  }

})