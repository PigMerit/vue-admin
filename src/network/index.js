import axios from 'axios'
import { getToKen, getUserName } from "@/utils/token.js";
//创建一个实例
const service = axios.create({
    baseURL:"/devApi",
    timeout:15000
})

//请求拦截器
service.interceptors.request.use(function (config) {
    config.headers['Tokey'] = getToKen()
    config.headers['UserName'] = getUserName()
    return config
})

//响应拦截器
service.interceptors.response.use(function (config) {
    return config
})

export default service