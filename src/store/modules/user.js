import { login, logout, refreshToken, queryUserInfo} from '@/api/user'
import { resetRouter } from '@/router'

const state = {
  token: localStorage.getItem('token') || '',
  userInfo: JSON.parse(localStorage.getItem('userInfo')) || {},
  refreshToken :localStorage.getItem('refreshToken') || ''
}

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
  },
  SET_REFRESH_TOKEN(state,refreshToken){
    state.refreshToken = refreshToken
  },
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
  },
  RESET_USER_INFO(state) {
    state.token = ''
    state.userInfo = {}
  }
}

const actions = {
  //登录方法
  login({ commit }, loginForm) {
    return new Promise(async (resolve, reject) => {
      try {
        const {data} = await login(loginForm)
        const token = data.value.access_token
        const refreshToken = data.value.refresh_token
        commit('SET_TOKEN', token)
        commit('SET_REFRESH_TOKEN', refreshToken)
        localStorage.setItem('token', token)
        localStorage.setItem('refreshToken', refreshToken)
        
        // 获取用户信息
        const res = await queryUserInfo()
        const userInfo = res.data.value
        commit('SET_USER_INFO', userInfo)
        
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
