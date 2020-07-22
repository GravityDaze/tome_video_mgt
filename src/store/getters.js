const getters = {
    token: state => state.user.token,
    userInfo: state => state.user.userInfo,
    menuList: state => state.permission.menuList,
    routerMap: state => state.permission.routerMap,
    isCollapse:state => state.permission.isCollapse
}

export default getters