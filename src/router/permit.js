import router from './index.js'
import store from '@/store'
import { Message } from 'element-ui'
// 加载进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
NProgress.configure({ showSpinner: false })

router.beforeEach(async (to, from, next) => {
  // 开启进度条
  NProgress.start()
  const token = store.getters.token
  if (token) {
    if (to.path === '/login') {
      next('/')
      NProgress.done()
    } else {
      // 动态更改title
      if (to.meta.title) {
        document.title = `${to.meta.title} - 途咪小视频后台管理系统`
      }
      // 如果不存在路由 则进行鉴权
      if (store.getters.routerMap.length === 0) {
        const accessRoutes = await store.dispatch('permission/getRouter')
        router.addRoutes(accessRoutes)
        next({ ...to, replace: true })
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