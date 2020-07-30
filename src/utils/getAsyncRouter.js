/*
    将后台返回的菜单数组转换为路由数组
*/

const _import = require('./_import_' + process.env.NODE_ENV) //获取组件的方法
import layout from '@/layout'
import err from '@/views/error-page/404'
import store from '@/store'
import _ from 'lodash'

// 遍历菜单数组生成动态路由
let asyncRouter = []
let breadcrumb = []
function resolveRoutes(routerMap) {
    routerMap.forEach(route => {
        if (!route.child) {
            // 查看该菜单是否是一级菜单,是则重置面包屑导航数据
            route.parentId === 1 && (breadcrumb = [])
            breadcrumb.push(route.name)
            // 解析路由路径
            if (route.route) {
                asyncRouter.push({
                    path: route.url,
                    name: route.name,
                    component: _import(route.route),
                    meta: {
                        breadcrumb:_.cloneDeep(breadcrumb),
                        title: route.name
                    }
                })
                // 每添加一次路由都清除本级导航标题,保留父级
                breadcrumb.pop()
            }
        }else{
            // 查看该菜单是否是一级菜单,是则重置面包屑导航数据
            route.parentId === 1 && (breadcrumb = [])
            breadcrumb.push(route.name)
            resolveRoutes(route.child)
        }
    })
}

// 挂载动态路由
export function getAsyncRouter() { 
    resolveRoutes(store.getters.menuList)
    const res = [
        {
            path: "/",
            name: "layout",
            component: layout,
            redirect: asyncRouter[0], //默认跳转到顺序1的路由
            children: asyncRouter
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
    // 清除全局变量asyncRouter和breadcrumb
    asyncRouter = []
    breadcrumb = []
    return res
}
