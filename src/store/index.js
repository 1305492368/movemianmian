import Vue from 'vue'
import Vuex from 'vuex'
// 导入用户信息api
import { auInfo } from '@/api/my.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: '',
    isLogin: false //true已登陆
  },
  mutations: {
    setUserInfo (state, value) {
      state.userInfo = value
    },
    setLoginStatus (state, value) {
      state.isLogin = value
    },
    // 修改userInfo内的数据
    setUserInfoOther (state, obj) {
      // {key:'collectArticles',value:value}
      state.userInfo[obj.key] = obj.value
      // state.userInfo.collectArticles = value
      // state.userInfo.starArticles = value
    }
  },
  actions: {
    // 刷新用户信息
    async refreshUserInfo (store) {
      // store是固定参数
      const res = await auInfo()
      store.commit('setUserInfo', res.data.data)
    }
  },
  // getters:依赖一个或者多个值(state的值)产生一个新的值,可以当属性使用
  getters: {
    getCollectTotal (state) {
      return state.userInfo === '' ? 0 : state.userInfo.collectQuestions.length
    },
    // 定义
    getUserInfo (state) {
      return state.userInfo
    },
    // 获取当前用户的是否收藏某文章
    getCollect (state) {
      return id => {
        return state.isLogin && state.userInfo.collectArticles.includes(id)
      }
    }
    //调用:this.$store.getters.getUserInfo
  },
  modules: {}
})
