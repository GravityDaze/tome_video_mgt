import axios from 'axios'
import { Message } from 'element-ui'

const BASE_URL = process.env.NODE_ENV === 'development' ? 'https://tome3pay.zhihuiquanyu.com' : 'https://tome3pay.zhihuiquanyu.com'
const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000
})

// 请求拦截器
instance.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    token && (config.headers['Authorization'] = `Bearer ${token}`)
    return config
}, err => {
    return Promise.reject(err)
})

// 响应拦截器
instance.interceptors.response.use(response => {
    // console.log(response)
    return response
}, err => {
    const { response } = err
    if (response) {
        switch (response.status) {
            case 401: //权限不足
                break
            case 403: //服务器拒绝执行
                break
            case 404: //not Found
                break
        }
    } else {
        if (!window.navigator.onLine) {
            // 断网
            return
        }
        return Promise.reject(err)
    }
})

export default instance
