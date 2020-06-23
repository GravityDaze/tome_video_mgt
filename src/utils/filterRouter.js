import store from '@/store/store'
export function filterRouter() { //遍历后台传来的菜单数组转换为组件对象

    let router = []
    const RouterMap = JSON.parse(store.state.menuList)
    for (const item of RouterMap) {
        router.push(item.child.map((v) => {
            return {
                path: v.url,
                name: v.name,
                component: () => import(`@/views/${item.nameEn}${v.url}`)
            }

        }))
    }

    // 覆盖layout路由
    return [{
        path: "/",
        name: "layout",
        component: () => import('@/views/layout'),
        redirect:router.flat()[0].path,
        children: router.flat()
    }]

}