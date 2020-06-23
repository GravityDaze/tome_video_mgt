import { getMenu } from '@/api/permission'

const state = {
    menuList:localStorage.getItem('menuList') || '[]'
}

const mutations = {
  SET_MENU(state,menuList){
    state.menuList = menuList
  }
}

const actions = {
    // 获取菜单列表
    getMenuList({commit}){
        return new Promise ( async resolve =>{
           const { data } = await getMenu()
           if( data.resultStatus.resultCode === '0000' ){
                commit('SET_MENU',JSON.stringify(data.value))
                localStorage.setItem('menuList',JSON.stringify(data.value))
                resolve()
           }
        } )
    }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
