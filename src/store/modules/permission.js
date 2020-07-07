import { getMenu } from '@/api/user'
import { filterRouter }  from '@/utils/filterRouter'

const state = {
  menuList: localStorage.getItem('menuList') || '[]',
  routerMap:[]
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
  }
}

const actions = {
  // 获取菜单列表
  getMenuList({ commit }) {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await getMenu()
        commit('SET_MENU', JSON.stringify(data.value))
        localStorage.setItem('menuList', JSON.stringify(data.value))
        resolve()
      } catch (err) {
       
        reject(err)
      }
    })
  },

  // 获取路由列表
  getRouter({commit}){
    return new Promise( (resolve,reject) =>{
      try{
        commit('SET_ROUTER',filterRouter())
        resolve()
      }catch(err){
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
