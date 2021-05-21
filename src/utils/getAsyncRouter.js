/*
    将后台返回的菜单数组转换为路由数组
*/

const _import = require('./_import_' + process.env.NODE_ENV) //获取组件的方法
import layout from '@/layout'
import err from '@/views/error-page/404'
import store from '@/store'

// 遍历菜单数组生成动态路由
function resolveRoutes(routerMap, breadcrumb = []) {
    const res = []
    routerMap.forEach(route => {
        const tmp = { ...route }
        if (tmp.child) {
            // 查看该菜单是否是一级菜单,是则重置面包屑数据
            route.parentId === 1 && (breadcrumb = [])
            breadcrumb.push(route.name)
            res.push(...resolveRoutes(tmp.child, breadcrumb))
        } else {
            route.parentId === 1 && (breadcrumb = [])
            breadcrumb.push(route.name)
            res.push({
                path: tmp.url,
                name: tmp.name,
                component: _import(tmp.route),
                meta: {
                    breadcrumb: [...breadcrumb],
                    title: tmp.name
                }
            })
            // 每添加一次路由都清除本级导航标题,保留父级
            breadcrumb.pop()
        }
    })
    return res
}


// 挂载动态路由
export function getAsyncRoutes() {
    const asyncRouter = resolveRoutes(store.getters.menuList)
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
    return res
}
