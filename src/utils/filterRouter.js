/*
    将后台返回的菜单数组转换为路由数组
*/

const _import = require('./_import_' + process.env.NODE_ENV) //获取组件的方法
import store from '@/store'
export function filterRouter() { //遍历vuex中的菜单数组转换为路由组件对象
    const router = []
    const RouterMap = JSON.parse(store.getters.menuList)
    for (const item of RouterMap) {
        router.push(item.child.map((v) => {
            return {
                path: v.url,
                name: v.name,
                component: _import(`${item.nameEn}${v.url}`),
                meta:[item.name,v.name]
            }
        }))
    }

    return [
        {
            path: "/",
            name: "layout",
            component: _import(`layout`),
            redirect: router.flat()[0].path,
            children: router.flat()
        }
    ]
}