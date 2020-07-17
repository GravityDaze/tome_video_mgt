import router from './index.js'
import store from '@/store'
import { Message } from 'element-ui'

// 加载进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
NProgress.configure({ showSpinner: false })

// 全局前置守卫 此处会出现报错 原因不明 但功能正常
router.beforeEach((to, from, next) => {
  // 开启进度条
  NProgress.start()
  const token = store.getters.token
  if (token) {
    // 调用刷新token接口

    if (to.path === '/login') {
      next('/')
      NProgress.done()
    } else {
      // 动态更改title
      if (to.meta.title) {
        document.title = `${to.meta.title} - 途咪小视频后台管理系统`
      }
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
      // 动态更改title
      if (to.meta.title) {
        document.title = `${to.meta.title} - 途咪小视频后台管理系统`
      }
      next()
    } else {
      Message.warning('请先登录')
      NProgress.done()
      next('/login')
    }
  }

})

// 全局后置守卫
router.afterEach(() => NProgress.done())