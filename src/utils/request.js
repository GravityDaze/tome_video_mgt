import axios from 'axios'
import { Message } from 'element-ui'
import router from '../router'
import store from '../store'

const instance = axios.create({
    baseURL: process.env.VUE_APP_BASE_URL,
    timeout: 10000
})

// 请求拦截器
instance.interceptors.request.use(config => {
    const token = store.getters.token 
    token && (config.headers['Authorization'] = `Bearer ${token}`)
    return config
}, err => {
    return Promise.reject(err)
})

// 响应拦截器
instance.interceptors.response.use(response => {
    return response
}, err => {
    const { response } = err
    if (response) {
        switch (response.status) {
            case 401: //权限不足
            Message.warning('登录过期')
                break
            case 404: 
            Message.warning('404 NOT FOUND')
                break
        }
        console.log(response)
        router.push('/login')
    } else {
        if (!window.navigator.onLine) {
            return Message.warning('网络错误')
        }
        return Promise.reject(err)
    }
})

export default instance
