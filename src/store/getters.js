const getters = {
    token: state => state.user.token,
    username: state => state.user.username,
    menuList: state => state.permission.menuList
}

export default getters