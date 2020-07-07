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
}, err => Promise.reject(err))

// 响应拦截器
instance.interceptors.response.use(response => {
    if(response.data.resultStatus){
        const { resultCode,resultMessage } = response.data.resultStatus
        if( resultCode === '0000' ){
            return response
        }else{
            Message.error(resultMessage)
            return Promise.reject(new Error(resultMessage || 'Error'))
        }
    }else{
        return response
    }

}, err => {
    const { response } = err
    if (response) {
        console.log( response.status )
        switch (response.status) {
            case 401: //权限不足
            Message.warning('登录过期')
            store.dispatch('user/logout').then( ()=>{
                router.push('/login')
            } )
                break
            case 404: 
            Message.warning('404 NOT FOUND')
                break
        }
    } else {
        if (!window.navigator.onLine) {
            return Message.warning('网络错误')
        }
    }
    return Promise.reject(err)
})

export default instance
