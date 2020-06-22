import store from '@/store/store'
export function filterRouter() { //遍历后台传来的路由字符串，转换为组件对象

    let router = []
    const RouterMap = store.state.menuList
    const RouterComps = JSON.parse(RouterMap)
    for (const item of RouterComps) {
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
        children: router.flat()
    }]

}