import { getMenu } from '@/api/user'
import { getAsyncRoutes }  from '@/utils/getAsyncRouter'

const state = {
  menuList: JSON.parse(localStorage.getItem('menuList')) || [],
  routerMap:[],
  isCollapse:JSON.parse(sessionStorage.getItem('isCollapse')) || false
}

const mutations = {
  SET_MENU(state, menuList) {
    state.menuList = menuList
  },
  SET_ROUTER(state,routerMap){
    state.routerMap = routerMap
  },
  RESET_ROUTER(state){
    state.routerMap = []
  },
  SET_COLLAPSE(state,isCollapse){
    state.isCollapse = isCollapse
  }
}

const actions = {
  // 获取菜单列表
  getMenuList({ commit }) {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await getMenu()
        commit('SET_MENU', data.value)
        localStorage.setItem('menuList', JSON.stringify(data.value))
        resolve()
      } catch (err) {
        console.log(err)
        reject(err)  
      }
    })
  },

  // 获取路由列表
  getRouter({commit}){
    return new Promise( (resolve,reject) =>{
      try{
        const accessedRoutes = getAsyncRoutes()
        commit('SET_ROUTER',accessedRoutes)
        resolve(accessedRoutes)
      }catch(err){
        console.log(err)
        reject(err)
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
