import Vue from "vue";
import Router from "vue-router";
import layout from "@/layout"
Vue.use(Router);

const createRouter = () => new Router({
  routes: [
    // 该路由详见:https://juejin.im/post/5c92ff94f265da6128275a85  => redirect 刷新页面
    {
      path:"/redirect",
      name:"redirect",
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
      name: "login",
      component: () => import('@/views/login'),
      meta:{
        title:'登录'
      }
    }
  ]
})

const router = createRouter()

// 重置动态路由
export const resetRouter = () => {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router

// 全量路由表，现由后端返回的导航菜单数据动态生成路由 详见:@/utils/filterRouter 
// const router = new Router({
//   routes: [
//     {
//       //登录页路由
//       path: "/login",
//       name: "login",
//       component: ()=>import('@/views/login')
//     },
//     {
//       path: "/",
//       name: "layout",
//       component: ()=>import('@/views/layout'),
//       children: [
//         {
//           //景区管理路由
//           path: "/scenerymanage",
//           name: "sceneryManage",
//           component: ()=>import('@/views/sceneryManage/sceneryManage')
//         },
//         {
//           //制作需求管理
//           path: "/makedemandmanage",
//           name: "makeDemandManage",
//           component: ()=>import('@/views/makeManage/makeDemandManage')
//         },
//         {
//           //小视频管理
//           path: "/smallvideomanage",
//           name: "smallVideoManage",
//           component: ()=>import('@/views/videoManage/smallVideoManage')
//         },
//         {
//           //价格设置管理
//           path: "/pricesetmanage",
//           name: "priceSetManage",
//           component: ()=>import('@/views/closeManage/priceSetManage')

//         },
//         {
//           //订单管理
//           path: "/ordermanage",
//           name: "orderManage",
//           component: ()=>import('@/views/closeManage/orderManage')
//         },
//         {
//           //订单结算管理
//           path: "/orderclose",
//           name: "orderClose",
//           component: ()=>import('@/views/closeManage/orderClose')
//         },
//         {
//           //用户管理
//           path: "/usermanage",
//           name: "userManage",
//           component: ()=>import('@/views/userManage/userManage')
//         },
//         {
//           //操作员管理
//           path: "/operatormanage",
//           name: "operatorManage",
//           component: ()=>import('@/views/systemManage/operatorManage')
//         },
//         {
//           //菜单管理
//           path: "/menumanage",
//           name: "menuManage",
//           component: ()=>import('@/views/systemManage/menuManage')
//         },
//         {
//           //角色管理
//           path: "/rolemanage",
//           name: "roleManage",
//           component: ()=>import('@/views/systemManage/roleManage')
//         },
//         {
//           //系统参数
//           path: "/systemparams",
//           name: "systemParams",
//           component: ()=>import('@/views/systemManage/systemParams')
//         },

//         {
//           //空镜头模板(合成视频模板)
//           path: "/sceneryshottemplate",
//           name: "sceneryShotTemplate",
//           component: ()=>import('@/views/videoManage/sceneryShotTemplate')
//         },
//         {
//           //模板点位界面
//           path: "/templatespot",
//           name: "templateSpot",
//           component: ()=>import('@/views/videoManage/templateSpot')
//         },
//         {
//           //标签管理路由
//           path: "/tagmanage",
//           name: "tagManage",
//           component: ()=>import('@/views/systemManage/tagManage')
//         },
//         {
//           //区域管理路由
//           path: "/areamanage",
//           name: "areaManage",
//           component: ()=>import('@/views/systemManage/areaManage')
//         },
//         {
//           // 审核中心
//           path:'/checkCenter',
//           name:'checkCenter',
//           component: ()=>import('@/views/checkManage/checkCenter')
//         }
//       ]
//     }
//   ]
// });
