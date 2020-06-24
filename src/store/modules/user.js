import { login, logout } from '@/api/user'

const state = {
  token: localStorage.getItem('token') || '',
  username: localStorage.getItem('user') || ''
}

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token
  },
  SET_USER_NAME(state, username) {
    state.username = username
  },
  RESET(state) {
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
        const username = userInfo.name
        commit('SET_TOKEN', token)
        commit('SET_USER_NAME', username)
        localStorage.setItem('token', token)
        localStorage.setItem('name', username)
        resolve()
      } catch (err) {
        reject(err)
      }
    })
  },

  // 注销方法
  logout({ commit , rootState }, username) {
    return new Promise(async (resolve, reject) => {
      try {
        await logout({ name: username })
        console.log(rootState)
        commit('RESET')
        localStorage.clear()
        resolve()
      } catch (err) {
        commit('RESET')
        localStorage.clear()
        reject(err)
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
