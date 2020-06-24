import _component from './_component'
import store from '@/store'
export function filterRouter() { //遍历后台传来的菜单数组转换为组件对象
    let router = []
    const RouterMap = JSON.parse(store.getters.menuList)
    for (const item of RouterMap) {
        router.push(item.child.map((v) => {
            return {
                path: v.url,
                name: v.name,
                component: _component(`${item.nameEn}${v.url}`)
            }
        }))
    }
    return [
        {
            path: "/",
            name: "layout",
            component: _component(`layout`),
            redirect: router.flat()[0].path,
            children: router.flat()
        }
    ]
}