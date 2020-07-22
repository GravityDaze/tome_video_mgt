import Vue from "vue";
import Router from "vue-router";
import layout from "@/layout"
Vue.use(Router);

const createRouter = () => new Router({
  routes: [
    // 该路由详见:https://juejin.im/post/5c92ff94f265da6128275a85  => redirect 刷新页面
    {
      path:"/redirect",
      name:"Redirect",
      component:layout,
      children: [
        {
          path: '/redirect/:path(.*)',
          component: () => import('@/views/redirect/index')
        }
      ]
    },
    {
      //登录页路由
      path: "/login",
      name: "Login",
      component: () => import('@/views/Login'),
      meta:{
        title:'登录'
      }
    }
  ]
})

const router = createRouter()

// 重置动态路由方法
export const resetRouter = () => {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点击菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router
