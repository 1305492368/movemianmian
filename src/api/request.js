import axios from 'axios'
// 导入toast
import { Toast } from 'vant'
// 导入删除token方法
import { removeLocal, getLocal } from '@/utils/local.js'
// 导入路由
import router from '@/router'
import store from '@/store'
// 创建一个副本
const _fetch = axios.create({
  baseURL: process.env.VUE_APP_URL
  //   widthCredentials:true
})
// 请求拦截
_fetch.interceptors.request.use(
  config => {
    // 如果接口不需要token你传了它就报错
    // 需要token才加,不需要不加
    // config.headers.authorization = `Bearer ` + getLocal()
    if (config.needToken) {
      config.headers.authorization = `Bearer ` + getLocal()
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)
// 响应拦截
_fetch.interceptors.response.use(
  res => {
    // window.console.log('响应拦截:', res)
    if (res.data.code === 200) {
      return res
    } else if (res.config.noError) {
      return Promise.reject(new Error('error'))
    }
    // else if (知道某个请求不需要错误处理) {
    //   return Promise.reject('error')
    // }
    // token错误   提示一下   删除token   跳转到登陆页 阻止.then执行  return Promise.reject(错误信息)
    else if (res.data.code === 401 || res.data.code === 403) {
      Toast.fail(res.data.message)
      removeLocal()
      router.push('/login?redirect=' + window.location.href.split('#')[1])
      // 登陆状态是true还是false
      store.commit('setLoginStatus', false)
      return Promise.reject(res.data.message)
      // this.$router
    } else {
      // 如果不是200,其它处理  提示错误信息 阻止.then执行  return Promise.reject(错误信息)
      Toast.fail(res.data.message)
      return Promise.reject(res.data.message)
    }
  },
  error => {
    return Promise.reject(error)
  }
)
export default _fetch
