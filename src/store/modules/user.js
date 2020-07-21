import { login, logout, refreshToken } from '@/api/user'
import { resetRouter } from '@/router'
import { clearRoutes }  from '@/utils/filterRouter'

const state = {
  token: localStorage.getItem('token') || '',
  username: localStorage.getItem('name') || '',
  refreshToken :localStorage.getItem('refreshToken') || ''
}

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
  },
  SET_REFRESH_TOKEN(state,refreshToken){
    state.refreshToken = refreshToken
  },
  SET_USER_NAME(state, username) {
    state.username = username
  },
  RESET_USER_INFO(state) {
    state.token = ''
    state.username = ''
  }
}

const actions = {
  //登录方法
  login({ commit }, userInfo) {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await login(userInfo)
        const token = data.value.access_token
        const refreshToken = data.value.refresh_token
        const username = userInfo.name
        commit('SET_TOKEN', token)
        commit('SET_REFRESH_TOKEN', refreshToken)
        commit('SET_USER_NAME', username)
        localStorage.setItem('token', token)
        localStorage.setItem('name', username)
        localStorage.setItem('refreshToken', refreshToken)
        resolve()
      } catch (err) {
        console.log(err)
        reject(err)
      }
    })
  },

  // 注销方法
  logout({ commit , rootState }, username) {
    return new Promise(async (resolve, reject) => {
      try {
        await logout({ name: username })
        resolve()
      } catch (err) {
        reject(err)
      } finally {
        // 重置vuex中的数据
        commit('RESET_USER_INFO')
        commit('permission/RESET_ROUTER',[],{root:true})
        localStorage.clear()
        sessionStorage.clear()
        // 清除全局变量newRouter,详见@/utils/filterRouter
        clearRoutes()
        // 重新实例化vue-router重置动态路由
        resetRouter()
      } 
    })
  },

  // 刷新token 暂未使用
  updateToken({commit,state}){
    return new Promise( async ( resolve, reject ) =>{
      try{
        const { data }  = await refreshToken({refreshToken:state.refreshToken})
        const newToken = data.value.access_token
        commit('SET_TOKEN', newToken)
        localStorage.setItem('token', newToken)
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
