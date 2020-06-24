import router from './index.js'
import store from '@/store'
import { Message } from 'element-ui'



// 全局前置守卫
router.beforeEach((to, from, next) => {
  console.log(to.path)
  // 如果直接进入登录页则放行
  // if (to.path === "/login") {
  //   next()
  // } else {
  //   const token = store.getters.token
  //   if (token) {
  //     // 查看vuex中是否保存了路由表 , 无则请求路由表
  //     if (store.getters.routerMap.length === 0) {
  //       store.dispatch('permission/getRouter').then(() => {
  //         router.addRoutes(store.getters.routerMap)
  //         next({ ...to, replace: true })
  //       }).catch(() => {
  //         next()
  //       })
  //     // 如果存在路由表 则正常跳转 
  //     } else {
  //       next()
  //     }
  //   } else {
  //     Message.warning('请先登录')
  //     next('/login')
  //   }
  // }

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