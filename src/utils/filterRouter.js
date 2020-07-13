/*
    将后台返回的菜单数组转换为路由数组
*/

const _import = require('./_import_' + process.env.NODE_ENV) //获取组件的方法
import layout from '@/views/layout'
import err from '@/views/errorPage/404'
import store from '@/store'
export function filterRouter() { //遍历vuex中的菜单数组转换为路由组件对象
    const router = []
    const RouterMap = JSON.parse(store.getters.menuList)
    console.log(RouterMap)
    for (const item of RouterMap) {
        router.push(item.child.map((v) => {
            return {
                path: v.url,
                name: v.name,
                component: _import(`${item.nameEn}${v.url}`),
                meta:{
                    breadcrumb:[item.name,v.name],
                    title:v.name
                }
            }
        }))
    }

    return [
        // 布局组件
        {
            path: "/",
            name: "layout",
            component: layout,
            redirect: router.flat()[0].path,
            children: router.flat()
        },
        // 404页面
        {
            path:'*',
            name:404,
            component:err,
            meta:{
                title:404
            }
        }
    ]
}