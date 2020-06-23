import { login, logout } from '@/api/user'
// import { getToken, setToken, removeToken } from '@/utils/auth'
// import router, { resetRouter } from '@/router'

const state = {
  token: localStorage.getItem('token'),
  username: localStorage.getItem('user')
}

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
  },
  SET_USER_NAME(state, username) {
    state.username = username
  },
  RESET( state ){
    state.token = ''
    state.username = ''
  }
}

const actions = {
  //登录方法
  login({ commit }, userInfo) {
    return new Promise( async resolve => {
      const { data } = await login(userInfo)
      if (data.resultStatus.resultCode === '0000') {
        const token = data.value.access_token
        const username = userInfo.name
        commit('SET_TOKEN', token)
        commit('SET_USER_NAME',username)
        localStorage.setItem('token',token)
        localStorage.setItem('name',name) 
        resolve()
      } else {
        resolve(data.resultStatus.resultMessage)
      }
    })
  },

  // 注销方法
  logout({commit},username){
    return new Promise( async resolve =>{
      await logout({name:username})
        commit('RESET')
        localStorage.clear()
        resolve()
    } )
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
