/*
    将后台返回的菜单数组转换为路由数组
*/

const _import = require('./_import_' + process.env.NODE_ENV) //获取组件的方法
import layout from '@/layout'
import err from '@/views/error-page/404'
import store from '@/store'

// 递归菜单数组生成路由,此处实现待改进
let newRouter = []
function resolveRouter(routerMap) {
    routerMap.forEach(route => {
        if (!route.child) {
            // 无子路由则解析路由路径
            if (route.route) {
                newRouter.push({
                    path: route.url,
                    name: route.name,
                    component: _import(route.route),
                    meta: {
                        breadcrumb: [route.name],
                        title: route.name
                    }
                })
            }

        }else{
            resolveRouter(route.child)
        }
    })
}

//生成动态路由
export function filterRouter() { 
    resolveRouter(store.getters.menuList)
    return[
        {
            path: "/",
            name: "layout",
            component: layout,
            redirect: newRouter[0], //默认跳转到顺序1的路由
            children: newRouter
        },
        //  404页面
        {
            path: '*',
            name: 404,
            component: err,
            meta: {
                title: 404
            }
        }
    ]

}

// 清除全局变量newRouter
export function clearRoutes(){
    newRouter = []
}