const getters = {
    token: state => state.user.token,
    username: state => state.user.username,
    menuList: state => state.permission.menuList,
    routerMap: state => state.permission.routerMap,
    isCollapse:state => state.permission.isCollapse
}

export default getters